import type {Request, Response} from 'express';
import {CoachingBasePrompt} from '../../../models/index.js';

export async function getCoachingBasePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const prompt = await CoachingBasePrompt.findById(id).lean();

  if (!prompt) {
    response.status(404).json({error: 'Base prompt not found'});
    return;
  }

  response.json({...prompt, id: prompt._id.toJSON()});
}
