import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import mime from 'mime-types';
import {
  type CreateArticleAttachmentResponse,
  type CreateArticleAttachmentParameters,
} from '../../client/ApiTypes';

const client = new S3Client({forcePathStyle: true});

export async function createArticleAttachment(
  request: Request,
  response: Response,
): Promise<void> {
  const {fileName} = request.params as CreateArticleAttachmentParameters;
  const contentType = mime.contentType(fileName);

  if (!contentType) {
    response.status(400).json({error: 'Invalid file type'});
    return;
  }

  const command = new PutObjectCommand({
    Key: fileName,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: request.body as Uint8Array,
    ContentType: contentType,
  });

  await client.send(command);

  response.json({
    path: encodeURIComponent(fileName),
  } satisfies CreateArticleAttachmentResponse);
}
