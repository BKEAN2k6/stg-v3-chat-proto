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
import {Community, UserImage, User} from '../../../models';
import routes from '../index';

const createCommunityMoment = applySchemas(
  routes['/communities/:id/moments'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
) =>
  createMocksAsync({
    body,
    params: {
      id: id.toHexString(),
    },
    user: {
      id: userId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    stats: {
      updateCommunityStrenghts: jest.fn(),
      updateLeaderboard: jest.fn(),
      getCommunityStats: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createCommunityMoment', () => {
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
      jest.spyOn(Community, 'findById').mockResolvedValueOnce(null);
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        {},
      );
      await createCommunityMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('creating a moment succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        avatar: 'testProfileImage.jpg',
      });

      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: community._id,
        originalImageUrl: 'test-original-image.jpg',
        resizedImageUrl: 'test-resized-image.jpg',
        thumbnailImageUrl: 'test-thumbnail-image.jpg',
        aspectRatio: 1,
      });

      mocks = createMocks(community._id, user._id, {
        content: 'This is a test moment',
        images: [userImage._id.toHexString()],
        strengths: ['love'],
      });

      await createCommunityMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the moment data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        postType: 'moment',
        comments: [],
        reactions: [],
        createdBy: {
          _id: expect.any(String),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        images: [
          {
            _id: expect.any(String),
            originalImageUrl: 'test-original-image.jpg',
            resizedImageUrl: 'test-resized-image.jpg',
            thumbnailImageUrl: 'test-thumbnail-image.jpg',
            aspectRatio: 1,
          },
        ],
        strengths: ['love'],
        content: 'This is a test moment',

        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
