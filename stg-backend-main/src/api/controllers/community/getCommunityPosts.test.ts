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
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {
  Community,
  Moment,
  Challenge,
  ProxyPost,
  ChallengeParticipation,
  Comment,
  SprintResult,
  Reaction,
  User,
  UserImage,
  Group,
} from '../../../models';
import routes from '../index';

const getCommunityPosts = applySchemas(routes['/communities/:id/posts'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getCommunityPosts', () => {
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

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getCommunityPosts(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        email: 'test@test.com',
        avatar: 'testProfileImage.jpg',
        firstName: 'Test',
        lastName: 'User',
      });

      const community = new Community({
        name: 'Test community',
        description: 'This is a test community',
      });

      const group = new Group({
        name: 'Test group',
        description: 'This is a test group',
        community: community._id,
      });

      const userImage = new UserImage({
        createdBy: user,
        thumbnailImageUrl: 'testThumbnailImage.jpg',
        resizedImageUrl: 'testResizedImage.jpg',
        originalImageUrl: 'testOriginalImage.jpg',
        community: community._id,
        aspectRatio: 1,
      });

      const moment = new Moment({
        content: 'This is a test moment',
        images: [userImage],
        strengths: ['love'],
        createdBy: user,
        community,
        groups: [group._id],
        users: [user._id],
      });

      const proxyMoment = new Moment({
        content: 'This is a test proxy moment',
        images: [userImage],
        strengths: ['love'],
        createdBy: user,
        community: new mongoose.Types.ObjectId(),
        groups: [group._id],
        users: [user._id],
      });

      const proxyPost = new ProxyPost({
        postReference: proxyMoment,
        community,
      });

      const challenge = new Challenge({
        translations: {
          en: 'Test challenge',
          fi: 'Testi haaste',
          sv: 'Test utmaning',
        },
        theme: 'default',
        showDate: new Date(),
        strength: 'love',
        community,
        groups: [group._id],
        users: [user._id],
      });

      const challengeParticipation = new ChallengeParticipation({
        user,
        challenge,
      });

      const sprintResult = new SprintResult({
        createdBy: user,
        community,
        strengths: [
          {
            strength: 'love',
            count: 1,
          },
        ],
      });

      const challengeComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for challenge',
        target: challenge._id,
        rootTarget: challenge._id,
        createdBy: user,
        images: [userImage],
      });

      const momentComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for moment',
        target: moment._id,
        rootTarget: moment._id,
        createdBy: user,
        images: [userImage],
      });

      const proxyMomentComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for proxy moment',
        target: proxyPost._id,
        rootTarget: proxyPost._id,
        createdBy: user,
        images: [userImage],
      });

      const sprintResultComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for sprint result',
        target: sprintResult._id,
        rootTarget: sprintResult._id,
        createdBy: user,
        images: [userImage],
      });

      const momentReaction = new Reaction({
        type: 'love',
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: user,
      });

      const proxyMomentReaction = new Reaction({
        type: 'love',
        community,
        target: proxyPost._id,
        rootTarget: proxyPost._id,
        createdBy: user,
      });

      const challengeReaction = new Reaction({
        type: 'love',
        community,
        target: challenge._id,
        rootTarget: challenge._id,
        createdBy: user,
      });

      const sprintResultReaction = new Reaction({
        type: 'love',
        community,
        target: sprintResult._id,
        rootTarget: sprintResult._id,
        createdBy: user,
      });

      const commentReaction = new Reaction({
        type: 'love',
        community,
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: user,
      });

      const commentComment = new Comment({
        level: 1,
        community,
        content: 'This is a test comment for comment',
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: user,
        images: [userImage],
      });

      const commentCommentReaction = new Reaction({
        type: 'compassion',
        community,
        target: commentComment._id,
        rootTarget: moment._id,
        createdBy: user,
      });

      await group.save();
      await userImage.save();
      await community.save();
      await challenge.save();
      await challengeParticipation.save();
      await challengeComment.save();
      await challengeReaction.save();
      await moment.save();
      await momentComment.save();
      await momentReaction.save();
      await proxyPost.save();
      await proxyMoment.save();
      await proxyMomentComment.save();
      await proxyMomentReaction.save();
      await sprintResult.save();
      await sprintResultComment.save();
      await sprintResultReaction.save();
      await commentReaction.save();
      await commentComment.save();
      await commentCommentReaction.save();

      mocks = createMocks(community._id);

      await getCommunityPosts(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community posts', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          postType: 'sprint-result',
          strengths: [{strength: 'love', count: 1}],
          createdBy: {
            _id: expect.any(String),
            avatar: 'testProfileImage.jpg',
            firstName: 'Test',
            lastName: 'User',
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              content: 'This is a test comment for sprint result',
              images: [
                {
                  _id: expect.any(String),
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
          reactions: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          postType: 'moment',
          isReference: true,
          createdBy: {
            _id: expect.any(String),
            firstName: 'Test',
            lastName: 'User',
            avatar: 'testProfileImage.jpg',
          },
          images: [
            {
              _id: expect.any(String),
              originalImageUrl: 'testOriginalImage.jpg',
              resizedImageUrl: 'testResizedImage.jpg',
              thumbnailImageUrl: 'testThumbnailImage.jpg',
              aspectRatio: 1,
            },
          ],
          content: 'This is a test proxy moment',
          strengths: ['love'],
          comments: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              content: 'This is a test comment for proxy moment',
              images: [
                {
                  _id: expect.any(String),
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
          reactions: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          _id: expect.any(String),
          postType: 'moment',
          createdBy: {
            _id: expect.any(String),
            firstName: 'Test',
            lastName: 'User',
            avatar: 'testProfileImage.jpg',
          },
          images: [
            {
              _id: expect.any(String),
              originalImageUrl: 'testOriginalImage.jpg',
              resizedImageUrl: 'testResizedImage.jpg',
              thumbnailImageUrl: 'testThumbnailImage.jpg',
              aspectRatio: 1,
            },
          ],
          content: 'This is a test moment',
          strengths: ['love'],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              content: 'This is a test comment for moment',
              images: [
                {
                  _id: expect.any(String),
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
                  _id: expect.any(String),
                  createdBy: {
                    _id: expect.any(String),
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
                  _id: expect.any(String),
                  createdBy: {
                    _id: expect.any(String),
                    firstName: 'Test',
                    lastName: 'User',
                    avatar: 'testProfileImage.jpg',
                  },
                  content: 'This is a test comment for comment',
                  images: [
                    {
                      _id: expect.any(String),
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
                      _id: expect.any(String),
                      createdBy: {
                        _id: expect.any(String),
                        firstName: 'Test',
                        lastName: 'User',
                        avatar: 'testProfileImage.jpg',
                      },
                      type: 'compassion',
                      createdAt: expect.any(String),
                    },
                  ],
                  comments: [],
                },
              ],
            },
          ],
          reactions: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          _id: expect.any(String),
          postType: 'challenge',
          translations: {
            fi: 'Testi haaste',
            en: 'Test challenge',
            sv: 'Test utmaning',
          },
          theme: 'default',
          strength: 'love',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
                firstName: 'Test',
                lastName: 'User',
                avatar: 'testProfileImage.jpg',
              },
              content: 'This is a test comment for challenge',
              images: [
                {
                  _id: expect.any(String),
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
          reactions: [
            {
              _id: expect.any(String),
              createdBy: {
                _id: expect.any(String),
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
              _id: expect.any(String),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
          ],
        },
      ]);
    });
  });
});
