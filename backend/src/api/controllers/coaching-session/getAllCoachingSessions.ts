import type {Request, Response} from 'express';
import {CoachingSession} from '../../../models/index.js';

export async function getAllCoachingSessions(
  _request: Request,
  response: Response,
): Promise<void> {
  const sessions = await CoachingSession.find()
    .sort({createdAt: -1})
    .populate('user', 'firstName lastName email')
    .lean();

  response.json(
    sessions.map((session) => {
      const user = session.user as unknown as
        | {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
          }
        | undefined;

      return {
        id: session._id.toJSON(),
        planTitle: session.planTitle,
        planDescription: session.planDescription,
        planContent: session.planContent,
        basePromptContent: session.basePromptContent,
        status: session.status,
        messages: session.messages,
        createdAt: session.createdAt?.toISOString(),
        updatedAt: session.updatedAt?.toISOString(),
        completedAt: session.completedAt?.toISOString(),
        summary: session.summary
          ? {
              title: session.summary.title,
              content: session.summary.content,
              completedAt: session.summary.completedAt?.toISOString(),
            }
          : undefined,
        user: user
          ? {
              id: String(user._id),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
            }
          : null,
      };
    }),
  );
}
