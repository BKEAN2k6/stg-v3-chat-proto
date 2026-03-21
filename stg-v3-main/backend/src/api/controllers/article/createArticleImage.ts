import crypto from 'node:crypto';
import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import {type CreateArticleImageResponse} from '../../client/ApiTypes.js';

const client = new S3Client({forcePathStyle: true});

export async function createArticleImage(
  request: Request,
  response: Response,
): Promise<void> {
  const fileName = `article-image-${crypto.randomBytes(4).toString('hex')}.jpg`;
  const data = request.body as Uint8Array;
  const resizedImage = await sharp(data)
    .flatten({background: '#ffffff'})
    .resize(1600, 1600, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .rotate()
    .jpeg({mozjpeg: true})
    .toBuffer();

  const command = new PutObjectCommand({
    Key: fileName,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: resizedImage,
    ContentType: 'image/jpeg',
  });

  await client.send(command);

  response.json({path: fileName} satisfies CreateArticleImageResponse);
}
