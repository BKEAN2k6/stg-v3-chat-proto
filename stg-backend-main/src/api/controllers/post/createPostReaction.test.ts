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
import {Moment, User, Reaction} from '../../../models';
import routes from '../index';

const createPostReaction = applySchemas(routes['/posts/:id/reactions'].post);

const createMocks = (postId: string, userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {
      type: 'love',
    },
    params: {
      id: postId,
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

describe('createPostReaction', () => {
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

  describe('when post is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId(),
      );

      await createPostReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Post not found',
      });
    });
  });

  describe('when post is found and creating a reaction succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const moment = await Moment.create({
        content: 'This is a test moment',
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });
      mocks = createMocks(moment._id.toHexString(), user._id);

      await createPostReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        createdBy: {
          _id: expect.any(String),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'test-avatar.jpg',
        },
        type: 'love',
        createdAt: expect.any(String),
      });
    });
  });

  describe('when reaction to the same post exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const moment = await Moment.create({
        content: 'This is a test moment',
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

      await Reaction.create({
        rootTarget: moment._id,
        target: moment._id,
        community: moment.community,
        createdBy: user._id,
        type: 'compassion',
      });
      mocks = createMocks(moment._id.toHexString(), user._id);

      await createPostReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the reaction', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        createdAt: expect.any(String),
        createdBy: {
          _id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'Test',
          lastName: 'User',
        },
        type: 'love',
      });
    });
  });
});
