import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {
  Post,
  Reaction,
  PostReactionNotification,
} from '../../../models/index.js';
import {
  type CreatePostReactionParameters,
  type CreatePostReactionRequest,
  type CreatePostReactionResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

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
    community: post.community._id,
    createdBy,
    type,
  });

  const communityId = post.community._id.toJSON();
  if (type !== 'like') {
    void request.stats.updateCommunityStrenghts(
      communityId,
      reaction.createdAt!,
      [type],
    );
  }

  await request.stats.updateLeaderboard(
    reaction.createdBy._id.toJSON(),
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

  if (!isDocument(reaction.createdBy)) {
    throw new Error('reaction.createdBy is not a document');
  }

  response.status(201).json({
    ...reaction.toJSON(),
    createdBy: {
      ...reaction.createdBy.toJSON(),
    },
    createdAt: reaction.createdAt!.toJSON(),
  } satisfies CreatePostReactionResponse);

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
            targetPost: post._id,
            reaction: reaction._id,
          },
        },
        {upsert: true},
      );
    }
  } catch (error) {
    request.error = error;
  }
}
