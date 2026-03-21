import type {Request, Response} from 'express';
import {CoachingService} from '../../../services/CoachingService/CoachingService.js';
import type {
  SendCoachingMessageRequest,
  SendCoachingMessageParameters,
} from '../../client/ApiTypes.js';

export async function sendCoachingMessage(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as SendCoachingMessageParameters;
  const {content, retryContext} = request.body as SendCoachingMessageRequest;
  const userId = request.user?.id;

  if (!userId) {
    response.status(401).json({error: 'Unauthorized'});
    return;
  }

  try {
    const result = await CoachingService.sendMessage(
      id,
      userId,
      content,
      retryContext,
    );
    response.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Session not found') {
      response.status(404).json({error: 'Session not found'});
      return;
    }

    throw error;
  }
}
