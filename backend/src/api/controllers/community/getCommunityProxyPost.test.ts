import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  Challenge,
  ProxyPost,
  UserImage,
  Community,
  Reaction,
  Comment,
  ChallengeParticipation,
} from '../../../models/index.js';
import {type Challenge as ChallengeDocument} from '../../../models/Post/Challenge.js';
import {type ProxyPost as ProxyPostDocument} from '../../../models/Post/ProxyPost.js';
import {type User as UserDocument} from '../../../models/User.js';
import {type Community as CommunityDocument} from '../../../models/Community.js';
import {type UserImage as UserImageDocument} from '../../../models/UserImage.js';
import {type Reaction as ReactionDocument} from '../../../models/Reaction.js';
import {type Comment as CommentDocument} from '../../../models/Comment.js';
import {type ChallengeParticipation as ChallengeParticipationDocument} from '../../../models/ChallengeParticipation.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const getCommunityProxyPost = applySchemas(
  routes['/communities/:id/proxy-posts/:postId'].get,
);

const createMocks = (
  communityId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
) => {
  return createMocksAsync({
    params: {
      id: communityId.toJSON(),
      postId: postId.toJSON(),
    },
  });
};

describe('getCommunityProxyPost', () => {
  let user: DocumentType<UserDocument>;
  let community: DocumentType<CommunityDocument>;
  let userImage: DocumentType<UserImageDocument>;
  let challenge: DocumentType<ChallengeDocument>;
  let challengeProxyPost: DocumentType<ProxyPostDocument>;
  let challengeReaction: DocumentType<ReactionDocument>;
  let challengeParticipation: DocumentType<ChallengeParticipationDocument>;
  let challengeComment: DocumentType<CommentDocument>;
  let challengeCommentReaction: DocumentType<ReactionDocument>;
  let challengeCommentComment: DocumentType<CommentDocument>;

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => {
        await collection.deleteMany({});
      }),
    );

    user = await registerTestUser({});

    community = new Community({
      name: 'Test community',
      description: 'This is a test community',
    });

    challenge = new Challenge({
      translations: {
        en: 'Test challenge',
        fi: 'Testi haaste',
        sv: 'Test utmaning',
      },
      theme: 'default',
      showDate: new Date(),
      strength: 'love',
      community,
      users: [user._id],
    });

    challengeProxyPost = new ProxyPost({
      postReference: challenge,
      community,
    });

    challengeParticipation = new ChallengeParticipation({
      user,
      challenge: challengeProxyPost,
    });

    userImage = new UserImage({
      createdBy: user,
      thumbnailImageUrl: 'testThumbnailImage.jpg',
      resizedImageUrl: 'testResizedImage.jpg',
      originalImageUrl: 'testOriginalImage.jpg',
      community: community._id,
      aspectRatio: 1,
    });

    challengeComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for challenge',
      target: challengeProxyPost._id,
      rootTarget: challengeProxyPost._id,
      createdBy: user,
      images: [userImage],
    });

    challengeReaction = new Reaction({
      type: 'love',
      community,
      target: challengeProxyPost._id,
      rootTarget: challengeProxyPost._id,
      createdBy: user,
    });

    challengeCommentReaction = new Reaction({
      type: 'love',
      community,
      target: challengeComment._id,
      rootTarget: challengeProxyPost._id,
      createdBy: user,
    });

    challengeCommentComment = new Comment({
      level: 1,
      community,
      content: 'This is a test comment for comment',
      target: challengeComment._id,
      rootTarget: challengeProxyPost._id,
      createdBy: user,
      images: [userImage],
    });

    await userImage.save();
    await community.save();
    await challenge.save();
    await challengeProxyPost.save();
    await challengeParticipation.save();
    await challengeComment.save();
    await challengeReaction.save();
    await challengeCommentComment.save();
    await challengeCommentReaction.save();
  });

  describe('when post is ProxyPost challenge', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(community._id, challenge._id);

      await getCommunityProxyPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the challenge', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: challengeProxyPost._id.toJSON(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        postType: 'challenge',
        isReference: true,
        translations: {
          fi: 'Testi haaste',
          en: 'Test challenge',
          sv: 'Test utmaning',
        },
        theme: 'default',
        strength: 'love',
        comments: [
          {
            id: challengeComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for challenge',
            images: [
              {
                id: userImage._id.toJSON(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [
              {
                id: challengeCommentReaction._id.toJSON(),
                createdBy: {
                  id: user._id.toJSON(),
                  firstName: 'TestFirstName',
                  lastName: 'TestLastName',
                  avatar: 'test-avatar.jpg',
                },
                type: 'love',
                createdAt: expect.any(String),
              },
            ],
            comments: [
              {
                id: challengeCommentComment._id.toJSON(),
                createdBy: {
                  id: user._id.toJSON(),
                  firstName: 'TestFirstName',
                  lastName: 'TestLastName',
                  avatar: 'test-avatar.jpg',
                },
                content: 'This is a test comment for comment',
                images: [
                  {
                    id: userImage._id.toJSON(),
                    originalImageUrl: 'testOriginalImage.jpg',
                    resizedImageUrl: 'testResizedImage.jpg',
                    thumbnailImageUrl: 'testThumbnailImage.jpg',
                    aspectRatio: 1,
                  },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                reactions: [],
                comments: [],
              },
            ],
          },
        ],
        reactions: [
          {
            id: challengeReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        participations: [
          {
            id: user._id.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
        ],
      });
    });
  });

  describe('when post is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(community._id, new mongoose.Types.ObjectId());

      await getCommunityProxyPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with status code 404', async () => {
      expect(mocks.res.statusCode).toBe(404);
    });
  });
});
