import type {Request, Response} from 'express';
import {CoachingSession} from '../../../models/index.js';

export async function getCoachingSessions(
  request: Request,
  response: Response,
): Promise<void> {
  const userId = request.user?.id;

  const sessions = await CoachingSession.find({user: userId})
    .sort({createdAt: -1})
    .lean();

  response.json(
    sessions.map((session) => ({
      id: session._id.toJSON(),
      planTitle: session.planTitle,
      planDescription: session.planDescription,
      status: session.status,
      messages: session.messages,
      createdAt: session.createdAt?.toISOString(),
      updatedAt: session.updatedAt?.toISOString(),
      completedAt: session.completedAt?.toISOString(),
    })),
  );
}
