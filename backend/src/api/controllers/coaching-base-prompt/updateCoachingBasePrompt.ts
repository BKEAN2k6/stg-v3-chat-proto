import type {Request, Response} from 'express';
import {CoachingBasePrompt} from '../../../models/index.js';

type UpdateBasePromptBody = {
  name?: string;
  content?: string;
};

export async function updateCoachingBasePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const {name, content} = request.body as UpdateBasePromptBody;
  const userId = request.user?.id;

  const prompt = await CoachingBasePrompt.findByIdAndUpdate(
    id,
    {
      ...(name !== undefined && {name}),
      ...(content !== undefined && {content}),
      updatedBy: userId,
    },
    {new: true},
  ).lean();

  if (!prompt) {
    response.status(404).json({error: 'Base prompt not found'});
    return;
  }

  response.json({...prompt, id: prompt._id.toJSON()});
}
