import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  Comment,
  Reaction,
  CommentReactionNotification,
} from '../../../models/index.js';
import {
  type CreateCommentReactionParameters,
  type CreateCommentReactionRequest,
  type CreateCommentReactionResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function createCommentReaction(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommentReactionParameters;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);
  const {type} = request.body as CreateCommentReactionRequest;

  const comment = await Comment.findById(id);
  if (!comment) {
    response.status(404).json({error: 'Comment not found'});
    return;
  }

  const existingReaction = await Reaction.findOne({
    target: comment._id,
    createdBy,
  });

  if (existingReaction) {
    await existingReaction.delete();
  }

  const reaction = await Reaction.create({
    community: comment.community._id,
    target: comment._id,
    rootTarget: comment.rootTarget._id,
    createdBy,
    type,
  });

  const communityId = comment.community._id.toJSON();

  if (type !== 'like') {
    await request.stats.updateCommunityStrenghts(
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

  response.status(201).json({
    ...reaction.toJSON(),
    createdBy: request.user,
    createdAt: reaction.createdAt!.toJSON(),
  } satisfies CreateCommentReactionResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      reaction.createdAt!,
    );

    if (!comment.createdBy._id.equals(reaction.createdBy._id)) {
      await CommentReactionNotification.updateOne(
        {
          user: comment.createdBy._id,
          actor: reaction.createdBy._id,
          targetComment: comment._id,
          targetPost: comment.rootTarget,
          isRead: false,
        },
        {
          $setOnInsert: {
            user: comment.createdBy._id,
            actor: reaction.createdBy._id,
            targetComment: comment._id,
            targetPost: comment.rootTarget._id,
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
