import type {Request, Response} from 'express';
import {
  CoachingSession,
  CoachingPlan,
  CoachingBasePrompt,
} from '../../../models/index.js';
import {CoachingService} from '../../../services/CoachingService/CoachingService.js';
import type {CreateCoachingSessionRequest} from '../../client/ApiTypes.js';

export async function createCoachingSession(
  request: Request,
  response: Response,
): Promise<void> {
  const {planId} = request.body as CreateCoachingSessionRequest;
  const userId = request.user?.id;

  // Fetch the plan with populated basePrompt
  const plan = await CoachingPlan.findById(planId).lean();

  if (!plan) {
    response.status(404).json({error: 'Plan not found'});
    return;
  }

  if (!plan.isPublished) {
    response.status(400).json({error: 'Plan is not published'});
    return;
  }

  // Fetch the base prompt
  const basePrompt = await CoachingBasePrompt.findById(plan.basePrompt).lean();

  if (!basePrompt) {
    response.status(400).json({error: 'Base prompt not found'});
    return;
  }

  // Create session with copied plan and base prompt data
  const session = await CoachingSession.create({
    planTitle: plan.title,
    planDescription: plan.description,
    planContent: plan.content,
    basePromptContent: basePrompt.content,
    user: userId,
    status: 'active',
    messages: [],
  });

  // Fire and forget - generate initial message async
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  CoachingService.generateInitialMessage(session._id.toJSON());

  // Return session immediately so user can navigate to chat
  response.status(201).json({
    id: session._id.toJSON(),
    planTitle: session.planTitle,
    planDescription: session.planDescription,
    planContent: session.planContent,
    basePromptContent: session.basePromptContent,
    status: session.status,
    messages: session.messages,
    createdAt: session.createdAt?.toISOString(),
    updatedAt: session.updatedAt?.toISOString(),
  });
}
