import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument, isDocumentArray} from '@typegoose/typegoose';
import {Post, Comment, PostCommentNotification} from '../../../models/index.js';
import {
  type CreatePostCommentParameters,
  type CreatePostCommentRequest,
  type CreatePostCommentResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

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
  const communityId = community._id.toJSON();
  const comment = await Comment.create({
    level: 0,
    community: community._id,
    target: post._id,
    rootTarget: post._id,
    createdBy,
    content,
    images,
  });

  await request.stats.updateLeaderboard(
    comment.createdBy._id.toJSON(),
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

  if (!isDocument(comment.createdBy)) {
    throw new Error('comment.createdBy is not a Document');
  }

  if (!isDocumentArray(comment.images)) {
    throw new Error('comment.images is not a Document array');
  }

  response.status(201).json({
    ...comment.toJSON(),
    createdBy: comment.createdBy.toJSON(),
    images: comment.images.map((image) => image.toJSON()),
    comments: [],
    reactions: [],
    createdAt: comment.createdAt!.toJSON(),
    updatedAt: comment.updatedAt!.toJSON(),
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
            targetPost: post._id,
            comment: comment._id,
          },
        },
        {upsert: true},
      );
    }
  } catch (error) {
    request.error = error;
  }
}
