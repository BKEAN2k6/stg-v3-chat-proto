import type mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {type Comment as CommentDocument} from '../../models/Comment';
import {type Reaction as ReactionDocument} from '../../models/Reaction';
import {type Comment, type Reaction} from '../client/ApiTypes';

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
    return {
      ...comment.toJSON(),
      reactions: commentReactions.map((reaction) => reaction.toJSON()),
      comments: buildTree(childComments, comments, reactions),
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
      .map((reaction) => reaction.toJSON()),
  };
};

export {buildCommentsAndReactions};
