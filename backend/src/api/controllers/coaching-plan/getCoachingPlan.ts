import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

export async function getCoachingPlan(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const plan = await CoachingPlan.findById(id).lean();

  if (!plan) {
    response.status(404).json({error: 'Coaching plan not found'});
    return;
  }

  response.json({
    ...plan,
    id: plan._id.toJSON(),
    basePromptId: plan.basePrompt._id.toJSON(),
  });
}
