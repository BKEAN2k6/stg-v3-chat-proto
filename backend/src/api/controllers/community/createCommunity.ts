import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Community} from '../../../models/index.js';
import {
  type CreateCommunityRequest,
  type CreateCommunityResponse,
} from '../../client/ApiTypes.js';
import {serializeCommunity} from './serializeCommunity.js';

export async function createCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, description, language, timezone} =
    request.body as CreateCommunityRequest;

  const community = await Community.create({
    name,
    description,
    language,
    timezone,
  });

  await community.upsertMemberAndSave(
    new mongoose.Types.ObjectId(request.user.id),
    'owner',
  );

  response
    .status(201)
    .json(serializeCommunity(community) satisfies CreateCommunityResponse);
}
