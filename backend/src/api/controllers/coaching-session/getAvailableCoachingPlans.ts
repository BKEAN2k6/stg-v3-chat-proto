import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

export async function getAvailableCoachingPlans(
  _request: Request,
  response: Response,
): Promise<void> {
  const plans = await CoachingPlan.find({isPublished: true})
    .select('title description order')
    .sort({order: 1})
    .lean();

  response.json(
    plans.map((plan) => ({
      id: plan._id.toJSON(),
      title: plan.title,
      description: plan.description,
    })),
  );
}
