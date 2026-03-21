import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

export async function getCoachingPlans(
  _request: Request,
  response: Response,
): Promise<void> {
  const plans = await CoachingPlan.find().sort({order: 1}).lean();
  response.json(
    plans.map((plan) => ({
      ...plan,
      id: plan._id.toJSON(),
      basePromptId: plan.basePrompt._id.toJSON(),
    })),
  );
}
