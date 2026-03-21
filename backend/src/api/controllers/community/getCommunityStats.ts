import {type Request, type Response} from 'express';
import {
  type GetCommunityStatsParameters,
  type GetCommunityStatsResponse,
} from '../../client/ApiTypes.js';

export async function getCommunityStats(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityStatsParameters;

  const stats = await request.stats.getCommunityStats(id, new Date());

  response.json(stats satisfies GetCommunityStatsResponse);
}
