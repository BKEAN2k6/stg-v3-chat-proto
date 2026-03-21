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
import {Moment, UserImage, User} from '../../../models';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import momentRoutes from '../index';

const updateMoment = applySchemas(momentRoutes['/moments/:id'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  imageId: mongoose.Types.ObjectId,
) => {
  return createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    body: {
      content: 'Test moment updated content',
      images: [imageId.toHexString()],
      strengths: ['gratitude'],
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
};

describe('updateMoment', () => {
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

  describe('when moment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await updateMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Moment not found',
      });
    });
  });

  describe('when moment is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        avatar: 'testProfileImage.jpg',
      });

      const moment = await Moment.create({
        content: 'This is a test moment',
        strengths: ['love'],
        createdBy: user._id,
        community: new mongoose.Types.ObjectId(),
        images: [],
      });

      const image = await UserImage.create({
        thumbnailImageUrl: 'testThumbnailImageUrl.jpg',
        resizedImageUrl: 'testResizedImageUrl.jpg',
        originalImageUrl: 'testOriginalImageUrl.jpg',
        aspectRatio: 1,
        createdBy: user._id,
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(moment._id, image._id);
      await updateMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the moment data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        postType: 'moment',
        content: 'Test moment updated content',
        strengths: ['gratitude'],
        images: [
          {
            _id: expect.any(String),
            originalImageUrl: 'testOriginalImageUrl.jpg',
            resizedImageUrl: 'testResizedImageUrl.jpg',
            thumbnailImageUrl: 'testThumbnailImageUrl.jpg',
            aspectRatio: 1,
          },
        ],
        comments: [],
        reactions: [],
        createdBy: {
          _id: expect.any(String),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
