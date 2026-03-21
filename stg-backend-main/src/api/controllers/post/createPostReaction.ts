import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Post, Reaction, PostReactionNotification} from '../../../models';
import {
  type CreatePostReactionParameters,
  type CreatePostReactionRequest,
  type CreatePostReactionResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function createPostReaction(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreatePostReactionParameters;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);
  const {type} = request.body as CreatePostReactionRequest;

  const post = await Post.findById(id);
  if (!post) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  const existingReaction = await Reaction.findOne({
    target: post._id,
    createdBy,
  });

  if (existingReaction) {
    await existingReaction.delete();
  }

  const reaction = await Reaction.create({
    rootTarget: post._id,
    target: post._id,
    community: post.community,
    createdBy,
    type,
  });

  const communityId = post.community._id.toHexString();
  if (type !== 'like') {
    void request.stats.updateCommunityStrenghts(
      communityId,
      reaction.createdAt!,
      [type],
    );
  }

  await request.stats.updateLeaderboard(
    reaction.createdBy._id.toHexString(),
    communityId,
    reaction.createdAt!,
    1,
  );
  await reaction.populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  response
    .status(201)
    .json(reaction.toJSON() satisfies CreatePostReactionResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      reaction.createdAt!,
    );
    if (
      (Post.isMoment(post) || Post.isSprintResult(post)) &&
      !post.createdBy._id.equals(reaction.createdBy._id)
    ) {
      await PostReactionNotification.updateOne(
        {
          user: post.createdBy._id,
          actor: reaction.createdBy._id,
          targetPost: post._id,
          isRead: false,
        },
        {
          $setOnInsert: {
            user: post.createdBy._id,
            actor: reaction.createdBy._id,
            targetPost: post,
            reaction,
          },
        },
        {upsert: true},
      );
    }
  } catch (error) {
    request.logger.log(error);
  }
}
