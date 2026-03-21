import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

type UpdateCoachingPlanBody = {
  title?: string;
  description?: string;
  content?: string;
  basePromptId?: string;
  isPublished?: boolean;
  order?: number;
};

export async function updateCoachingPlan(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const {title, description, content, basePromptId, isPublished, order} =
    request.body as UpdateCoachingPlanBody;
  const userId = request.user?.id;

  const plan = await CoachingPlan.findByIdAndUpdate(
    id,
    {
      ...(title !== undefined && {title}),
      ...(description !== undefined && {description}),
      ...(content !== undefined && {content}),
      ...(basePromptId !== undefined && {basePrompt: basePromptId}),
      ...(isPublished !== undefined && {isPublished}),
      ...(order !== undefined && {order}),
      updatedBy: userId,
    },
    {new: true},
  ).lean();

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
