import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Community, UserImage} from '../../../models/index.js';
import {
  type CreateCommunityUserImageParameters,
  type CreateCommunityUserImageResponse,
} from '../../client/ApiTypes.js';
import {uploadImageVersions} from './uploadImageVersions.js';

export async function createCommunityUserImage(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommunityUserImageParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const data = request.body as Uint8Array;

  const userImage = await UserImage.create({
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    community,
    ...(await uploadImageVersions(data)),
  });

  response
    .status(201)
    .json(userImage.toJSON() satisfies CreateCommunityUserImageResponse);
}
