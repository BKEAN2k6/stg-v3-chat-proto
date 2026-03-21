import {type Request, type Response} from 'express';
import {TranslationJob} from '../../../models/index.js';
import {
  type GetTranslationJobParameters,
  type GetTranslationJobResponse,
} from '../../client/ApiTypes.js';

export async function getTranslationJob(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetTranslationJobParameters;
  const translationJob = await TranslationJob.findById(id);
  if (!translationJob) {
    response.status(404).json({error: 'Translation job not found'});
    return;
  }

  response.json(translationJob.toJSON() satisfies GetTranslationJobResponse);
}
