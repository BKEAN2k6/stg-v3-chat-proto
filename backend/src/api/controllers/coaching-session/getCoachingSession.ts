import type {Request, Response} from 'express';
import {CoachingSession} from '../../../models/index.js';

export async function getCoachingSession(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const userId = request.user?.id;

  const session = await CoachingSession.findOne({_id: id, user: userId}).lean();

  if (!session) {
    response.status(404).json({error: 'Session not found'});
    return;
  }

  response.json({
    id: session._id.toJSON(),
    planTitle: session.planTitle,
    planDescription: session.planDescription,
    status: session.status,
    messages: session.messages,
    createdAt: session.createdAt?.toISOString(),
    updatedAt: session.updatedAt?.toISOString(),
    completedAt: session.completedAt?.toISOString(),
  });
}
