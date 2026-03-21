import {type Request, type Response} from 'express';
import {AiGuidanceService} from '../../../services/AiGuidanceService/AiGuidanceService.js';
import {type GetAiGuidanceParameters} from '../../client/ApiTypes.js';

type GetAiGuidanceQuery = {
  clientHour?: string;
  clientWeekday?: string;
};

export async function getAiGuidance(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetAiGuidanceParameters;
  const {clientHour, clientWeekday} = request.query as GetAiGuidanceQuery;

  const now = new Date();
  const hour = clientHour ? Number.parseInt(clientHour, 10) : now.getHours();
  const weekday =
    clientWeekday ?? now.toLocaleDateString('en-US', {weekday: 'long'});

  try {
    const result = await AiGuidanceService.getGuidanceForGroup(
      id,
      {
        hour,
        weekday,
      },
      request.user?.id,
    );
    response.json(result);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AI Guidance Error:', error);
    response.status(500).json({error: 'Failed to generate guidance'});
  }
}
