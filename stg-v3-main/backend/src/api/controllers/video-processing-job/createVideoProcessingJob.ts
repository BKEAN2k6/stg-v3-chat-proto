import process from 'node:process';
import {type Request, type Response} from 'express';
import {
  type CreateVideoProcessingJobRequest,
  type CreateVideoProcessingJobResponse,
} from '../../client/ApiTypes.js';
import {VideoProcessingJob} from '../../../models/index.js';

export async function createVideoProcessingJob(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    url,
    type,
    source,
    fileName,
    videoSegments,
    lottieSegments,
    loop,
    coverFrameTimestamp,
  } = request.body as CreateVideoProcessingJobRequest;

  const existingJob = await VideoProcessingJob.findOne({
    fileName: `stg-videos/${fileName}`,
  });
  if (existingJob?.status === 'processing') {
    response.status(400).json({
      error:
        'A video processing job with the same file name is already processing',
    });
    return;
  }

  await existingJob?.deleteOne();

  const job = await VideoProcessingJob.create({
    url,
    type,
    source,
    videoSegments,
    lottieSegments,
    loop,
    coverFrameTimestamp,
    fileName: `stg-videos/${fileName}`,
    status: 'processing',
  });

  try {
    const response = await fetch(
      'https://hkcpkyfs64j2xavke47vpmym6i0ncgrr.lambda-url.eu-north-1.on.aws/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callbackUrl: `${process.env.BACKEND_URL}/api/v1/video-processing-jobs/callback/${job._id.toJSON()}`,
          url,
          type,
          source,
          coverFrameTimestamp,
          segments: videoSegments,
        }),
      },
    );

    const {error} = (await response.json()) as {error?: string};
    if (error) {
      throw new Error(error);
    }
  } catch (error) {
    job.status = 'failed';
    job.errorMessage = (error as Error).message ?? 'Unknown error';
    await job.save();
    response
      .status(500)
      .json({error: 'Failed to initiate video processing job'});
    return;
  }

  response.status(201).json({
    ...job.toJSON(),
    id: job._id.toJSON(),
    createdAt: job.createdAt!.toISOString(),
    updatedAt: job.updatedAt!.toISOString(),
  } satisfies CreateVideoProcessingJobResponse);
}
