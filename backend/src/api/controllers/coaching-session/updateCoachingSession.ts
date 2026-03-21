import type {Request, Response} from 'express';
import {CoachingSession} from '../../../models/index.js';
import type {UpdateCoachingSessionRequest} from '../../client/ApiTypes.js';

export async function updateCoachingSession(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const {status} = request.body as UpdateCoachingSessionRequest;
  const userId = request.user?.id;

  const updateData: Record<string, unknown> = {};

  if (status !== undefined) {
    updateData.status = status;
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
  }

  const session = await CoachingSession.findOneAndUpdate(
    {_id: id, user: userId},
    updateData,
    {new: true},
  ).lean();

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
