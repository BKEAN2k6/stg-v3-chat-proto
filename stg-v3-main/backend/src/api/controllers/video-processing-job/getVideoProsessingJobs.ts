import {type Request, type Response} from 'express';
import {type GetVideoProcessingJobsResponse} from '../../client/ApiTypes.js';
import {VideoProcessingJob} from '../../../models/index.js';

export async function getVideoProcessingJobs(
  request: Request,
  response: Response,
): Promise<void> {
  const jobs = await VideoProcessingJob.find().sort('fileName');

  response.status(200).json(
    jobs.map((job) => ({
      ...job.toJSON(),
      id: job._id.toJSON(),
      createdAt: job.createdAt!.toISOString(),
      updatedAt: job.updatedAt!.toISOString(),
    })) satisfies GetVideoProcessingJobsResponse,
  );
}
