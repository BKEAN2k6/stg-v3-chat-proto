import {type Request, type Response} from 'express';
import {
  type GetCommunityParameters,
  type GetCommunityResponse,
} from '../../client/ApiTypes.js';
import {Community} from '../../../models/index.js';
import {serializeCommunity} from './serializeCommunity.js';

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

  response.json(serializeCommunity(community) satisfies GetCommunityResponse);
}
