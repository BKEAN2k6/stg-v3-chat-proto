import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocumentArray} from '@typegoose/typegoose';
import {Moment, Community} from '../../../models/index.js';
import {
  type CreateCommunityMomentRequest,
  type CreateCommunityMomentParameters,
  type CreateCommunityMomentResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function createCommunityMoment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: communityId} = request.params as CreateCommunityMomentParameters;

  const community = await Community.findById(communityId);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const {content, images, strengths} =
    request.body as CreateCommunityMomentRequest;

  const moment = await Moment.create({
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    community: community._id,
    content,
    images,
    strengths,
  });

  if (strengths && strengths.length > 0) {
    void request.stats.updateCommunityStrenghts(
      communityId,
      moment.createdAt!,
      strengths,
    );
  }

  void request.stats.updateLeaderboard(
    moment.createdBy._id.toJSON(),
    communityId,
    moment.createdAt!,
    1,
  );

  await moment.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  if (!isDocumentArray(moment.images)) {
    response.status(404).json({error: 'Images not found'});
    return;
  }

  response.status(201).json({
    ...moment.toJSON(),
    images: moment.images.map((image) => image.toJSON()),
    createdBy: request.user,
    comments: [],
    reactions: [],
    createdAt: moment.createdAt!.toJSON(),
    updatedAt: moment.updatedAt!.toJSON(),
    postType: 'moment',
  } satisfies CreateCommunityMomentResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      moment.createdAt!,
    );
  } catch (error) {
    request.error = error;
  }
}
