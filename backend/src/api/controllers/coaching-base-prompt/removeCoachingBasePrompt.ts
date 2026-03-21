import type {Request, Response} from 'express';
import {CoachingBasePrompt, CoachingPlan} from '../../../models/index.js';

export async function removeCoachingBasePrompt(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;

  // Check if any plans reference this base prompt
  const usageCount = await CoachingPlan.countDocuments({basePrompt: id});

  if (usageCount > 0) {
    response.status(400).json({
      error: `Cannot delete: this base prompt is used by ${usageCount} plan(s)`,
    });
    return;
  }

  await CoachingBasePrompt.findByIdAndDelete(id);
  response.sendStatus(204);
}
