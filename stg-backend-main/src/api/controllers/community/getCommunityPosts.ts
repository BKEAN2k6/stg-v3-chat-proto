import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {
  Community,
  Post,
  Comment,
  Reaction,
  ChallengeParticipation,
} from '../../../models';
import {
  type GetCommunityPostsParameters,
  type GetCommunityPostsQuery,
} from '../../client/ApiTypes';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions';

export async function getCommunityPosts(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityPostsParameters;
  const {startDate, limit} = request.query as GetCommunityPostsQuery;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const initialPosts = await Post.find({
    community: community._id,
    createdAt: {$lt: new Date()},
    ...(startDate && {createdAt: {$lt: new Date(startDate)}}),
  })
    .populate({
      path: 'postReference',
    })
    .sort({createdAt: -1})
    .limit(Number(limit));

  const posts = initialPosts.map((post) => {
    if (Post.isProxyPost(post) && isDocument(post.postReference)) {
      return new Post({
        ...post.postReference.toJSON(),
        _id: post._id,
        community: post.community,
        createdAt: post.createdAt,
        isReference: true,
      });
    }

    return post;
  });

  await Post.populate(posts, [
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

  const postIds = posts.map((post) => post._id);
  const challegeIds = posts
    .filter((post) => Post.isChallenge(post))
    .map((post) => post._id);

  const [comments, reactions, challengeParticipations] = await Promise.all([
    Comment.find({
      rootTarget: {$in: postIds},
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
      rootTarget: {$in: postIds},
    }).populate([
      {
        path: 'createdBy',
        select: '_id firstName lastName avatar',
      },
    ]),
    ChallengeParticipation.find({
      challenge: {
        $in: challegeIds,
      },
    }).populate([
      {
        path: 'user',
        select: '_id firstName lastName avatar',
      },
    ]),
  ]);

  const postsWithComments = posts.map((post) => {
    return {
      ...post.toJSON(),
      ...buildCommentsAndReactions(post._id, comments, reactions),
      ...(Post.isChallenge(post) && {
        participations: challengeParticipations
          .filter(
            (participation) =>
              participation.challenge._id.equals(post._id) &&
              isDocument(participation.user),
          )
          .map((participation) => participation.user.toJSON()),
      }),
    };
  });

  response.json(postsWithComments);
}
