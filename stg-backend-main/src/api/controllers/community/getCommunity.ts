import {type Request, type Response} from 'express';
import {
  type GetCommunityParameters,
  type GetCommunityResponse,
} from '../../client/ApiTypes';
import {Community} from '../../../models';

export async function getCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityParameters;
  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  response.json(community.toJSON() satisfies GetCommunityResponse);
}
