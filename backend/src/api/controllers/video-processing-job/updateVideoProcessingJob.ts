import process from 'node:process';
import {type Request, type Response} from 'express';
import {
  type UpdateVideoProcessingJobParameters,
  type UpdateVideoProcessingJobRequest,
  type UpdateVideoProcessingJobResponse,
} from '../../client/ApiTypes.js';
import {VideoProcessingJob} from '../../../models/index.js';

export async function updateVideoProcessingJob(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateVideoProcessingJobParameters;
  const {status, coverFrameTimestamp} =
    request.body as UpdateVideoProcessingJobRequest;

  const job = await VideoProcessingJob.findById(id);

  if (!job) {
    response.status(404).json({
      error: 'VideoProcessingJob not found',
    });
    return;
  }

  if (coverFrameTimestamp !== undefined) {
    job.coverFrameTimestamp = coverFrameTimestamp;
  }

  if (status === 'processing') {
    job.status = 'processing';
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
            url: job.url,
            type: job.type,
            source: job.source,
            segments: job.videoSegments,
            coverFrameTimestamp: job.coverFrameTimestamp,
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
  }

  await job.save();

  response.status(200).json({
    ...job.toJSON(),
    id: job._id.toJSON(),
    createdAt: job.createdAt!.toISOString(),
    updatedAt: job.updatedAt!.toISOString(),
  } satisfies UpdateVideoProcessingJobResponse);
}
