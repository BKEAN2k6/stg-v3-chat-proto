import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Moment, Comment, Reaction} from '../../../models';
import {
  type UpdateMomentParameters,
  type UpdateMomentRequest,
  type UpdateMomentResponse,
  type StrengthSlug,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions';

export async function updateMoment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateMomentParameters;

  const moment = await Moment.findById(id);
  if (!moment) {
    response.status(404).json({error: 'Moment not found'});
    return;
  }

  const communityId = moment.community._id.toHexString();
  const {content, strengths, images} = request.body as UpdateMomentRequest;

  if (content) {
    moment.content = content;
  }

  if (images) {
    moment.images = images.map((image) => new mongoose.Types.ObjectId(image));
  }

  if (strengths) {
    void request.stats.updateCommunityStrenghts(
      communityId,
      moment.createdAt!,
      strengths,
      moment.strengths,
    );

    moment.strengths = strengths as mongoose.Types.Array<StrengthSlug>;
  }

  await moment.save();
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

  const comments = await Comment.find({
    rootTarget: moment._id,
  }).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  const reactions = await Reaction.find({
    rootTarget: moment._id,
  }).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  response.status(200).json({
    ...moment.toJSON(),
    ...buildCommentsAndReactions(moment._id, comments, reactions),
  } satisfies UpdateMomentResponse);

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
