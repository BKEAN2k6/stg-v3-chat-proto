import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Post, Comment, PostCommentNotification} from '../../../models';
import {
  type CreatePostCommentParameters,
  type CreatePostCommentRequest,
  type CreatePostCommentResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function createPostComment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreatePostCommentParameters;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);
  const {content, images} = request.body as CreatePostCommentRequest;

  const post = await Post.findById(id);
  if (!post) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  const commentCount = await Comment.countDocuments({
    rootTarget: post._id,
  });

  if (commentCount >= Comment.MAX_COMMENTS) {
    response.status(400).json({error: 'Max comment count for thread reached'});
    return;
  }

  const {community} = post;
  const communityId = community._id.toHexString();
  const comment = await Comment.create({
    level: 0,
    community,
    target: post._id,
    rootTarget: post._id,
    createdBy,
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
    comments: [],
    reactions: [],
  } satisfies CreatePostCommentResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      comment.createdAt!,
    );
    if (
      (Post.isMoment(post) || Post.isSprintResult(post)) &&
      !post.createdBy._id.equals(comment.createdBy._id)
    ) {
      await PostCommentNotification.updateOne(
        {
          user: post.createdBy._id,
          actor: comment.createdBy._id,
          targetPost: post._id,
          isRead: false,
        },
        {
          $setOnInsert: {
            user: post.createdBy._id,
            actor: comment.createdBy._id,
            targetPost: post,
            comment,
          },
        },
        {upsert: true},
      );
    }
  } catch (error) {
    request.logger.log(error);
  }
}
