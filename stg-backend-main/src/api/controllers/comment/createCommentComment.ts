import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Comment, CommentCommentNotification} from '../../../models';
import {
  type CreateCommentCommentParameters,
  type CreateCommentCommentRequest,
  type CreateCommentCommentResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function createCommentComment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommentCommentParameters;
  const {content, images} = request.body as CreateCommentCommentRequest;

  const targetComment = await Comment.findById(id);
  if (!targetComment) {
    response.status(404).json({error: 'Comment not found'});
    return;
  }

  if (targetComment.level >= Comment.MAX_LEVEL) {
    response.status(400).json({error: 'Max comment level reached'});
    return;
  }

  const commentCount = await Comment.countDocuments({
    rootTarget: targetComment.rootTarget,
  });

  if (commentCount >= Comment.MAX_COMMENTS) {
    response.status(400).json({error: 'Max comment count for thread reached'});
    return;
  }

  const {community} = targetComment;
  const communityId = community._id.toHexString();
  const comment = await Comment.create({
    community,
    level: targetComment.level + 1,
    target: targetComment._id,
    rootTarget: targetComment.rootTarget,
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    content,
    images,
  });

  await request.stats.updateLeaderboard(
    comment.createdBy._id.toHexString(),
    communityId,
    comment.createdAt!,
    1,
  );

  await comment.populate([
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
    ...comment.toJSON(),
    reactions: [],
    comments: [],
  } satisfies CreateCommentCommentResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      comment.createdAt!,
    );
    if (!comment.createdBy._id.equals(targetComment.createdBy._id)) {
      await CommentCommentNotification.updateOne(
        {
          user: targetComment.createdBy._id,
          actor: comment.createdBy._id,
          targetComment: targetComment._id,
          targetPost: targetComment.rootTarget,
          isRead: false,
        },
        {
          $setOnInsert: {
            user: targetComment.createdBy._id,
            actor: comment.createdBy._id,
            targetComment: targetComment._id,
            targetPost: targetComment.rootTarget._id,
            comment: comment._id,
          },
        },
        {upsert: true},
      );
    }
  } catch (error) {
    request.logger.log(error);
  }
}
