import type {Request, Response} from 'express';
import {CoachingSession} from '../../../models/index.js';

export async function removeCoachingSession(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const userId = request.user?.id;

  // Only allow users to delete their own sessions
  const result = await CoachingSession.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!result) {
    response.status(404).json({error: 'Session not found'});
    return;
  }

  response.sendStatus(204);
}
