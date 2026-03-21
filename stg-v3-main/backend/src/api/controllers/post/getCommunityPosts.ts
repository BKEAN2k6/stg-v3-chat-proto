import {type Request, type Response} from 'express';
import {isDocument, isDocumentArray} from '@typegoose/typegoose';
import {
  Community,
  Post,
  Comment,
  Reaction,
  ChallengeParticipation,
} from '../../../models/index.js';
import {
  type GetCommunityPostsParameters,
  type GetCommunityPostsResponse,
  type GetCommunityPostsQuery,
  type Moment,
  type CoachPost,
  type Challenge,
  type SprintResult,
  type LessonCompleted,
  type OnboardingCompleted,
  type GoalCompleted,
  type StrengthCompleted,
  type Group,
} from '../../client/ApiTypes.js';
import {buildCommentsAndReactions} from '../buildCommentsAndReactions.js';

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
        community: post.community._id,
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
    {
      path: 'group',
      select: '_id name description language ageGroup articleProgress',
      populate: {
        path: 'owner',
        select: '_id firstName lastName avatar',
      },
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

  const postsWithComments: GetCommunityPostsResponse = posts.map((post) => {
    const commonProperties = {
      ...buildCommentsAndReactions(post._id, comments, reactions),
      createdAt: post.createdAt!.toJSON(),
      updatedAt: post.updatedAt!.toJSON(),
    };

    if (Post.isChallenge(post)) {
      const participations = challengeParticipations.filter((participation) =>
        participation.challenge._id.equals(post._id),
      );

      return {
        ...post.toJSON(),
        ...commonProperties,
        participations: participations.map((participation) => {
          if (!isDocument(participation.user)) {
            throw new Error('participation.user is not a Document');
          }

          return participation.user.toJSON();
        }),

        postType: 'challenge',
      } satisfies Challenge;
    }

    if (Post.isCoachPost(post)) {
      if (!isDocumentArray(post.images)) {
        throw new Error('post.images is not a Document array');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        images: post.images.map((image) => image.toJSON()),
        postType: 'coach-post',
      } satisfies CoachPost;
    }

    if (Post.isMoment(post)) {
      if (!isDocumentArray(post.images)) {
        throw new Error('post.images is not a Document array');
      }

      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        images: post.images.map((image) => image.toJSON()),
        createdBy: post.createdBy.toJSON(),
        postType: 'moment',
      } satisfies Moment;
    }

    if (Post.isSprintResult(post)) {
      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        createdBy: post.createdBy.toJSON(),
        postType: 'sprint-result',
      } satisfies SprintResult;
    }

    if (Post.isLessonCompleted(post)) {
      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      if (!isDocument(post.group)) {
        throw new Error('post.group is not a Document');
      }

      if (!isDocument(post.group.owner)) {
        throw new Error('post.group.owner is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        createdBy: post.createdBy.toJSON(),
        group: {
          id: post.group._id.toString(),
          name: post.group.name,
          description: post.group.description,
          owner: post.group.owner.toJSON(),
          language: post.group.language,
          ageGroup: post.group.ageGroup,
          articleProgress: post.group.articleProgress.map((p) => ({
            article: p.article._id.toString(),
            completionDate: p.completionDate.toJSON(),
          })),
        } satisfies Group,
        postType: 'lesson-completed',
      } satisfies LessonCompleted;
    }

    if (Post.isOnboardingCompleted(post)) {
      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        createdBy: post.createdBy.toJSON(),
        postType: 'onboarding-completed',
      } satisfies OnboardingCompleted;
    }

    if (Post.isGoalCompleted(post)) {
      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      if (!isDocument(post.group)) {
        throw new Error('post.group is not a Document');
      }

      if (!isDocument(post.group.owner)) {
        throw new Error('post.group.owner is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        createdBy: post.createdBy.toJSON(),
        group: {
          id: post.group._id.toString(),
          name: post.group.name,
          description: post.group.description,
          owner: post.group.owner.toJSON(),
          language: post.group.language,
          ageGroup: post.group.ageGroup,
          articleProgress: post.group.articleProgress.map((p) => ({
            article: p.article._id.toString(),
            completionDate: p.completionDate.toJSON(),
          })),
        } satisfies Group,
        postType: 'goal-completed',
      } satisfies GoalCompleted;
    }

    if (Post.isStrengthCompleted(post)) {
      if (!isDocument(post.createdBy)) {
        throw new Error('post.createdBy is not a Document');
      }

      if (!isDocument(post.group)) {
        throw new Error('post.group is not a Document');
      }

      if (!isDocument(post.group.owner)) {
        throw new Error('post.group.owner is not a Document');
      }

      return {
        ...post.toJSON(),
        ...commonProperties,
        createdBy: post.createdBy.toJSON(),
        group: {
          id: post.group._id.toString(),
          name: post.group.name,
          description: post.group.description,
          owner: post.group.owner.toJSON(),
          language: post.group.language,
          ageGroup: post.group.ageGroup,
          articleProgress: post.group.articleProgress.map((p) => ({
            article: p.article._id.toString(),
            completionDate: p.completionDate.toJSON(),
          })),
        } satisfies Group,
        postType: 'strength-completed',
      } satisfies StrengthCompleted;
    }

    throw new Error('Post type is not recognized');
  });

  response.json(postsWithComments);
}
