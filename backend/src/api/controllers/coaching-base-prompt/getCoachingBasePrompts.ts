import type {Request, Response} from 'express';
import {CoachingBasePrompt} from '../../../models/index.js';

export async function getCoachingBasePrompts(
  _request: Request,
  response: Response,
): Promise<void> {
  const prompts = await CoachingBasePrompt.find().sort({name: 1}).lean();
  response.json(
    prompts.map((prompt) => ({...prompt, id: prompt._id.toJSON()})),
  );
}
