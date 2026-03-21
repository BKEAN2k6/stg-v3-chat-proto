import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

type CreateCoachingPlanBody = {
  title: string;
  description: string;
  content: string;
  basePromptId: string;
  isPublished?: boolean;
  order?: number;
};

export async function createCoachingPlan(
  request: Request,
  response: Response,
): Promise<void> {
  const {title, description, content, basePromptId, isPublished, order} =
    request.body as CreateCoachingPlanBody;
  const userId = request.user?.id;

  const plan = await CoachingPlan.create({
    title,
    description,
    content,
    basePrompt: basePromptId,
    isPublished: isPublished ?? false,
    order: order ?? 0,
    createdBy: userId,
    updatedBy: userId,
  });

  response.status(201).json({
    ...plan.toJSON(),
    id: plan._id.toJSON(),
    basePromptId: plan.basePrompt._id.toJSON(),
  });
}
