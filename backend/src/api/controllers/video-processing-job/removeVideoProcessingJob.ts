import process from 'node:process';
import {type Request, type Response} from 'express';
import {S3Client, DeleteObjectsCommand} from '@aws-sdk/client-s3';
import {type RemoveVideoProcessingJobParameters} from '../../client/ApiTypes.js';
import {VideoProcessingJob} from '../../../models/index.js';

const client = new S3Client({forcePathStyle: true});
export async function removeVideoProcessingJob(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveVideoProcessingJobParameters;

  const job = await VideoProcessingJob.findById(id);
  if (!job) {
    response.status(404).json({error: 'VideoProcessingJob not found'});
    return;
  }

  if (job.files.length > 0) {
    try {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Delete: {Objects: job.files.map((Key) => ({Key}))},
        }),
      );
    } catch {
      response
        .status(500)
        .json({error: 'Failed to delete associated files from S3'});
      return;
    }
  }

  await job.deleteOne();
  response.sendStatus(204);
}
