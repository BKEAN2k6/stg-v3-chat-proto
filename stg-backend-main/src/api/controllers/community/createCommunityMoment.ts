import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Moment, Community} from '../../../models';
import {
  type CreateCommunityMomentRequest,
  type CreateCommunityMomentParameters,
  type CreateCommunityMomentResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

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
    community,
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
    moment.createdBy._id.toHexString(),
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

  response.status(201).json({
    ...moment.toJSON(),
    comments: [],
    reactions: [],
  } satisfies CreateCommunityMomentResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      moment.createdAt!,
    );
  } catch (error) {
    request.logger.log(error);
  }
}
