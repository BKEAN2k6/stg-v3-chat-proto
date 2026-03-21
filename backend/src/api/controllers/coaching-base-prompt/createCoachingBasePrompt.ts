import type {Request, Response} from 'express';
import {CoachingBasePrompt} from '../../../models/index.js';

type CreateBasePromptBody = {
  name: string;
  content: string;
};

export async function createCoachingBasePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, content} = request.body as CreateBasePromptBody;
  const userId = request.user?.id;

  const prompt = await CoachingBasePrompt.create({
    name,
    content,
    createdBy: userId,
    updatedBy: userId,
  });

  response.status(201).json({...prompt.toJSON(), id: prompt._id.toJSON()});
}
