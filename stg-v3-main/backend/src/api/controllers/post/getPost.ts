import {type Request, type Response} from 'express';
import {isDocument, type DocumentType} from '@typegoose/typegoose';
import {
  Post,
  Comment,
  Reaction,
  ChallengeParticipation,
} from '../../../models/index.js';
import {type Post as PostDocument} from '../../../models/Post/Post.js';
import {type GetPostParameters} from '../../client/ApiTypes.js';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions.js';

export async function getPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPostParameters;

  const initialPost = await Post.findById(id).populate({path: 'postReference'});

  if (!initialPost) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  const post =
    Post.isProxyPost(initialPost) && isDocument(initialPost.postReference)
      ? new Post({
          ...initialPost.postReference.toJSON(),
          _id: initialPost._id,
          community: initialPost.community,
          createdAt: initialPost.createdAt,
          isReference: true,
        })
      : (initialPost as DocumentType<PostDocument>);

  await Post.populate(post, [
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
    {
      path: 'group',
      select: '_id name description language ageGroup articleProgress',
      populate: {
        path: 'owner',
        select: '_id firstName lastName avatar',
      },
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
      ? ChallengeParticipation.find({
          challenge: post._id,
        }).populate([
          {
            path: 'user',
            select: '_id firstName lastName avatar',
            strictPopulate: false,
          },
        ])
      : Promise.resolve([]),
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
    createdAt: post.createdAt!.toISOString(),
    updatedAt: post.updatedAt!.toISOString(),
  });
}
