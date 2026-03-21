import {Buffer} from 'node:buffer';
import process from 'node:process';
import crypto from 'node:crypto';
import {type Readable} from 'node:stream';
import {brotliCompressSync, constants as zlibConstants} from 'node:zlib';
import {type Request, type Response} from 'express';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import unzipper from 'unzipper';
import {type VideoProcessingJobCallbackParameters} from '../../client/ApiTypes.js';
import {VideoProcessingJob} from '../../../models/index.js';

const client = new S3Client({forcePathStyle: true});

const {CALLBACK_SECRET} = process.env;
const MAX_SKEW_MS = 5 * 60 * 1000; // 5 minutes
const BUCKET = process.env.AWS_S3_BUCKET_NAME;

function safeEqualHex(aHex: string, bHex: string): boolean {
  try {
    const a = Buffer.from(aHex, 'hex');
    const b = Buffer.from(bHex, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function computeSig(secret: string, ts: string, body: Uint8Array): string {
  return crypto
    .createHmac('sha256', secret)
    .update(ts)
    .update('.')
    .update(body)
    .digest('hex');
}

export function verifyCallback(
  request: Request,
  body: Uint8Array,
): {ok: true} | {ok: false; reason: string} {
  const tsHeader = request.header('x-callback-timestamp');
  const sigHeader = request.header('x-callback-signature');

  if (!CALLBACK_SECRET)
    return {ok: false, reason: 'Server missing CALLBACK_SECRET'};
  if (!tsHeader || !sigHeader)
    return {ok: false, reason: 'Missing signature headers'};

  const ts = Number(tsHeader);
  if (!Number.isFinite(ts))
    return {ok: false, reason: 'Invalid timestamp header'};

  if (Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
    return {ok: false, reason: 'Stale or future-dated callback'};
  }

  const expected = computeSig(CALLBACK_SECRET, String(ts), body);
  if (!safeEqualHex(sigHeader, expected)) {
    return {ok: false, reason: 'Signature mismatch'};
  }

  return {ok: true};
}

// eslint-disable-next-line complexity
export async function videoProcessingJobCallback(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as VideoProcessingJobCallbackParameters;

  const rawBody: Uint8Array = Buffer.isBuffer(request.body)
    ? request.body
    : typeof request.body === 'string'
      ? Buffer.from(request.body, 'utf8')
      : Buffer.from(
          // Fallback – Express may have parsed JSON already
          JSON.stringify(request.body ?? {}),
          'utf8',
        );

  const v = verifyCallback(request, rawBody);
  if (!v.ok) {
    response.status(401).json({error: v.reason});
    return;
  }

  const job = await VideoProcessingJob.findById(id);
  if (!job) {
    response.status(404).json({error: 'VideoProcessingJob not found'});
    return;
  }

  if (job.status !== 'processing') {
    response.sendStatus(200);
    return;
  }

  const isJson = request.is('application/json');
  const isZip =
    request.is('application/zip') ??
    (request.headers['content-type'] ?? '')
      .toLowerCase()
      .startsWith('application/zip');

  if (isJson) {
    const body = ((): {error?: string} => {
      try {
        if (typeof request.body === 'object' && request.body !== null) {
          const maybeError = (request.body as {error?: unknown}).error;
          if (typeof maybeError === 'string') return {error: maybeError};
        }

        const parsed: unknown = JSON.parse(
          Buffer.from(rawBody).toString('utf8'),
        );
        if (parsed && typeof parsed === 'object') {
          const maybeError = (parsed as {error?: unknown}).error;
          if (typeof maybeError === 'string') return {error: maybeError};
        }

        return {};
      } catch {
        return {};
      }
    })();

    job.status = 'failed';
    job.errorMessage = body?.error ?? 'Unknown error';
    await job.save();
    response.sendStatus(200);
    return;
  }

  if (isZip) {
    const zip = await unzipper.Open.buffer(Buffer.from(rawBody));

    const manifestEntry = zip.files.find(
      (f) => f.path === 'videoSegments.json',
    );
    if (!manifestEntry) {
      response.status(400).json({error: 'videoSegments.json missing in ZIP'});
      return;
    }

    const mp4Entries = zip.files.filter((f) => f.path.endsWith('.mp4'));
    const backgroundEntry = zip.files.find((f) => f.path === 'background.png');
    const lottieEntry = zip.files.find((f) => f.path === 'lottie.json');
    const fullVideoEntry = zip.files.find((f) => f.path === 'video.mp4');
    const coverEntry = zip.files.find((f) => f.path === 'cover.webp');

    const manifestBuf = await manifestEntry.buffer();
    let videoSegments: Array<{
      filename: string;
      loop: boolean;
      showToolbar: boolean;
      autoplay: boolean;
    }>;
    try {
      videoSegments = JSON.parse(manifestBuf.toString('utf8')) as Array<{
        filename: string;
        loop: boolean;
        showToolbar: boolean;
        autoplay: boolean;
      }>;
      if (!Array.isArray(videoSegments))
        throw new Error('videoSegments not an array');
    } catch {
      response.status(400).json({error: 'Invalid videoSegments.json'});
      return;
    }

    const byName = new Map<string, unzipper.File>();
    for (const entry of mp4Entries) byName.set(entry.path, entry);

    const uploads: Array<Promise<any>> = [];
    for (const [i, element] of videoSegments.entries()) {
      const original = element;
      const expectedName = original.filename ?? `segment-${i}.mp4`;
      const entry = byName.get(expectedName);
      if (!entry) {
        response
          .status(400)
          .json({error: `Missing segment media in ZIP: ${expectedName}`});
        return;
      }

      const newBaseName = `${job.fileName}/segment-${i}.mp4`;
      const Key = `${newBaseName}`;

      let contentLength = (entry as any)?.vars?.uncompressedSize as
        | number
        | undefined;

      let body: Readable | Uint8Array;

      if (typeof contentLength === 'number' && Number.isFinite(contentLength)) {
        body = entry.stream() as unknown as Readable; // Stream upload
      } else {
        // eslint-disable-next-line no-await-in-loop
        const fallbackBuf = await entry.buffer();
        body = fallbackBuf; // Buffer upload
        contentLength = fallbackBuf.length;
      }

      uploads.push(
        client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key,
            Body: body,
            ContentType: 'video/mp4',
            ContentLength: contentLength,
          }),
        ),
      );

      job.files.push(Key);

      original.filename = newBaseName;
    }

    if (backgroundEntry) {
      const backgroundKey = `${job.fileName}/background.png`;
      let bgContentLength = (backgroundEntry as any)?.vars?.uncompressedSize as
        | number
        | undefined;

      let bgBody: Readable | Uint8Array;
      if (
        typeof bgContentLength === 'number' &&
        Number.isFinite(bgContentLength)
      ) {
        bgBody = backgroundEntry.stream() as unknown as Readable;
      } else {
        const bgBuf = await backgroundEntry.buffer();
        bgBody = bgBuf;
        bgContentLength = bgBuf.length;
      }

      uploads.push(
        client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: backgroundKey,
            Body: bgBody,
            ContentType: 'image/png',
            ContentLength: bgContentLength,
          }),
        ),
      );

      job.files.push(backgroundKey);
    }

    let coverKey: string | undefined;
    if (coverEntry) {
      coverKey = `${job.fileName}/cover.webp`;
      let coverContentLength = (coverEntry as any)?.vars?.uncompressedSize as
        | number
        | undefined;

      let coverBody: Readable | Uint8Array;
      if (
        typeof coverContentLength === 'number' &&
        Number.isFinite(coverContentLength)
      ) {
        coverBody = coverEntry.stream() as unknown as Readable;
      } else {
        const coverBuf = await coverEntry.buffer();
        coverBody = coverBuf;
        coverContentLength = coverBuf.length;
      }

      uploads.push(
        client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: coverKey,
            Body: coverBody,
            ContentType: 'image/webp',
            ContentLength: coverContentLength,
          }),
        ),
      );

      job.files.push(coverKey);
    }

    let lottieKey: string | undefined;
    if (lottieEntry) {
      lottieKey = `${job.fileName}/lottie.json`;

      const lottieBuf = await lottieEntry.buffer();
      const lottieCompressed = brotliCompressSync(lottieBuf, {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
          [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
        },
      });

      uploads.push(
        client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: lottieKey,
            Body: lottieCompressed,
            ContentType: 'application/json',
            ContentEncoding: 'br',
            ContentLength: lottieCompressed.length,
          }),
        ),
      );

      job.files.push(lottieKey);
    }

    let fullVideoKey: string | undefined;

    if (fullVideoEntry) {
      fullVideoKey = `${job.fileName}/video.mp4`;

      let fvContentLength = (fullVideoEntry as any)?.vars?.uncompressedSize as
        | number
        | undefined;

      let fvBody: Readable | Uint8Array;
      if (
        typeof fvContentLength === 'number' &&
        Number.isFinite(fvContentLength)
      ) {
        fvBody = fullVideoEntry.stream() as unknown as Readable; // Stream upload
      } else {
        const fvBuf = await fullVideoEntry.buffer();
        fvBody = fvBuf;
        fvContentLength = fvBuf.length;
      }

      uploads.push(
        client.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: fullVideoKey,
            Body: fvBody,
            ContentType: 'video/mp4',
            ContentLength: fvContentLength,
          }),
        ),
      );

      job.files.push(fullVideoKey);
    }

    const manifestOut = {
      video: {
        segments: videoSegments,
        file: fullVideoEntry ? fullVideoKey : undefined,
      },
      lottie: lottieEntry
        ? {
            file: lottieKey,
            segments: job.lottieSegments,
          }
        : undefined,
      background: backgroundEntry
        ? `${job.fileName}/background.png`
        : undefined,
      loop: Boolean(job.loop),
      cover: coverEntry ? coverKey : undefined,
    } as const;

    const manifestOutBuf = Buffer.from(JSON.stringify(manifestOut), 'utf8');
    const manifestKey = `${job.fileName}/manifest.json`;
    uploads.push(
      client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: manifestKey,
          Body: manifestOutBuf,
          ContentType: 'application/json',
          ContentLength: manifestOutBuf.length,
        }),
      ),
    );

    job.files.push(manifestKey);

    try {
      await Promise.all(uploads);
    } catch (error) {
      job.status = 'failed';
      job.errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed uploading segments to S3';
      await job.save();
      response.status(500).json({error: job.errorMessage});
      return;
    }

    job.status = 'completed';
    await job.save();

    response.sendStatus(200);
    return;
  }

  response.status(400).json({error: 'Invalid request'});
}
