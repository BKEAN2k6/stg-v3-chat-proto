import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  Challenge,
  ProxyPost,
  User,
  UserImage,
  Community,
  Reaction,
  Comment,
  ChallengeParticipation,
} from '../../../models';
import {type Challenge as ChallengeDocument} from '../../../models/Post/Challenge';
import {type ProxyPost as ProxyPostDocument} from '../../../models/Post/ProxyPost';
import {type User as UserDocument} from '../../../models/User';
import {type Community as CommunityDocument} from '../../../models/Community';
import {type UserImage as UserImageDocument} from '../../../models/UserImage';
import {type Reaction as ReactionDocument} from '../../../models/Reaction';
import {type Comment as CommentDocument} from '../../../models/Comment';
import {type ChallengeParticipation as ChallengeParticipationDocument} from '../../../models/ChallengeParticipation';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const getCommunityProxyPost = applySchemas(
  routes['/communities/:id/proxy-posts/:postId'].get,
);

const createMocks = (
  communityId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
) => {
  return createMocksAsync({
    params: {
      id: communityId.toHexString(),
      postId: postId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });
};

describe('getCommunityProxyPost', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mongoose.connect(global.__MONGO_URI__, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dbName: global.__MONGO_DB_NAME__,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

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

    user = await User.create({
      email: 'test@test.com',
      avatar: 'testProfileImage.jpg',
      firstName: 'Test',
      lastName: 'User',
    });

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
        _id: challengeProxyPost._id.toHexString(),
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
            _id: challengeComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for challenge',
            images: [
              {
                _id: userImage._id.toHexString(),
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
                _id: challengeCommentReaction._id.toHexString(),
                createdBy: {
                  _id: user._id.toHexString(),
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: 'testProfileImage.jpg',
                },
                type: 'love',
                createdAt: expect.any(String),
              },
            ],
            comments: [
              {
                _id: challengeCommentComment._id.toHexString(),
                createdBy: {
                  _id: user._id.toHexString(),
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: 'testProfileImage.jpg',
                },
                content: 'This is a test comment for comment',
                images: [
                  {
                    _id: userImage._id.toHexString(),
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
            _id: challengeReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        participations: [
          {
            _id: user._id.toHexString(),
            firstName: 'Test',
            lastName: 'User',
            avatar: 'testProfileImage.jpg',
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
