import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument, isDocumentArray} from '@typegoose/typegoose';
import {Comment, Reaction} from '../../../models/index.js';
import {
  type UpdateCommentParameters,
  type UpdateCommentRequest,
  type UpdateCommentResponse,
} from '../../client/ApiTypes.js';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions.js';

export async function updateComment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateCommentParameters;
  const {content, images} = request.body as UpdateCommentRequest;

  const comment = await Comment.findById(id).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);
  if (!comment) {
    response.status(404).json({error: 'Comment not found'});
    return;
  }

  if (content) {
    comment.content = content;
  }

  if (images) {
    comment.images = images.map((image) => new mongoose.Types.ObjectId(image));
  }

  const reactions = await Reaction.find({
    rootTarget: comment.rootTarget,
  }).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  const comments = await Comment.find({
    rootTarget: comment.rootTarget,
  }).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  await comment.save();
  await comment.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
  ]);

  if (!isDocument(comment.createdBy)) {
    throw new Error('Comment createdBy is not populated');
  }

  if (!isDocumentArray(comment.images)) {
    throw new Error('Comment images are not populated');
  }

  response.json({
    ...comment.toJSON(),
    createdBy: comment.createdBy.toJSON(),
    images: comment.images.map((image) => image.toJSON()),
    createdAt: comment.createdAt!.toJSON(),
    updatedAt: comment.updatedAt!.toJSON(),
    ...buildCommentsAndReactions(comment._id, comments, reactions),
  } satisfies UpdateCommentResponse);
}
