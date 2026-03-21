import type mongoose from 'mongoose';
import {
  isDocument,
  isDocumentArray,
  type DocumentType,
} from '@typegoose/typegoose';
import {type Comment as CommentDocument} from '../../models/Comment.js';
import {type Reaction as ReactionDocument} from '../../models/Reaction.js';
import {type Comment, type Reaction} from '../client/ApiTypes.js';

const buildTree = (
  rootComments: Array<DocumentType<CommentDocument>>,
  comments: Array<DocumentType<CommentDocument>> = [],
  reactions: Array<DocumentType<ReactionDocument>> = [],
): Comment[] => {
  return rootComments.map((comment) => {
    const commentReactions = reactions.filter((reaction) =>
      reaction.target.equals(comment._id),
    );
    const childComments = comments.filter((childComment) =>
      childComment.target.equals(comment._id),
    );
    if (!isDocument(comment.createdBy)) {
      throw new Error('User not found');
    }

    if (!isDocumentArray(comment.images)) {
      throw new Error('Image not found');
    }

    return {
      ...comment.toJSON(),
      createdBy: comment.createdBy.toJSON(),
      reactions: commentReactions.map((reaction) => {
        if (!isDocument(reaction.createdBy)) {
          throw new Error('User not found');
        }

        return {
          ...reaction.toJSON(),
          createdBy: reaction.createdBy.toJSON(),
          createdAt: reaction.createdAt!.toJSON(),
          updatedAt: reaction.updatedAt!.toJSON(),
        };
      }),
      images: comment.images.map((image) => image.toJSON()),
      comments: buildTree(childComments, comments, reactions),
      createdAt: comment.createdAt!.toJSON(),
      updatedAt: comment.updatedAt!.toJSON(),
    };
  });
};

const buildCommentsAndReactions = (
  targetId: mongoose.Types.ObjectId,
  comments: Array<DocumentType<CommentDocument>>,
  reactions: Array<DocumentType<ReactionDocument>>,
): {comments: Comment[]; reactions: Reaction[]} => {
  const rootComments = comments.filter((comment) =>
    comment.target.equals(targetId),
  );

  return {
    comments: buildTree(rootComments, comments, reactions),
    reactions: reactions
      .filter((reaction) => reaction.target.equals(targetId._id))
      .map((reaction) => {
        if (!isDocument(reaction.createdBy)) {
          throw new Error('User not found');
        }

        return {
          ...reaction.toJSON(),
          createdBy: reaction.createdBy.toJSON(),
          createdAt: reaction.createdAt!.toJSON(),
          updatedAt: reaction.updatedAt!.toJSON(),
        };
      }),
  };
};

export {buildCommentsAndReactions};
