import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Comment, Reaction} from '../../../models';
import {
  type UpdateCommentParameters,
  type UpdateCommentRequest,
  type UpdateCommentResponse,
} from '../../client/ApiTypes';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions';

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

  response.json({
    ...comment.toJSON(),
    ...buildCommentsAndReactions(comment._id, comments, reactions),
  } satisfies UpdateCommentResponse);
}
