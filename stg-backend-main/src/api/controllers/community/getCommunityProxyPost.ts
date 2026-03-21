import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  Post,
  ProxyPost,
  Comment,
  Reaction,
  ChallengeParticipation,
} from '../../../models';
import {type GetCommunityProxyPostParameters} from '../../client/ApiTypes';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions';

export async function getCommunityProxyPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, postId} = request.params as GetCommunityProxyPostParameters;
  const postReference = new mongoose.Types.ObjectId(postId);
  const community = new mongoose.Types.ObjectId(id);

  const proxyPost = await ProxyPost.findOne({
    postReference,
    community,
  }).populate({path: 'postReference'});

  if (!proxyPost || !isDocument(proxyPost.postReference)) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  const post = new Post({
    ...proxyPost.postReference.toJSON(),
    _id: proxyPost._id,
    community: proxyPost.community,
    createdAt: proxyPost.createdAt,
    isReference: true,
  });

  await post.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
      strictPopulate: false,
    },
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
      strictPopulate: false,
    },
  ]);

  const [comments, reactions, participations] = await Promise.all([
    Comment.find({
      rootTarget: post._id,
    }).populate([
      {
        path: 'images',
        select:
          '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
      },
      {
        path: 'createdBy',
        select: '_id firstName lastName avatar',
      },
    ]),
    Reaction.find({
      rootTarget: post._id,
    }).populate([
      {
        path: 'createdBy',
        select: '_id firstName lastName avatar',
      },
    ]),
    Post.isChallenge(post)
      ? await ChallengeParticipation.find({
          challenge: post._id,
        }).populate([
          {
            path: 'user',
            select: '_id firstName lastName avatar',
            strictPopulate: false,
          },
        ])
      : [],
  ]);

  response.json({
    ...post.toJSON(),
    ...buildCommentsAndReactions(post._id, comments, reactions),
    ...(Post.isChallenge(post) && {
      participations: participations
        .filter(
          (participation) =>
            participation.challenge._id.equals(post._id) &&
            isDocument(participation.user),
        )
        .map((participation) => participation.user.toJSON()),
    }),
  });
}
