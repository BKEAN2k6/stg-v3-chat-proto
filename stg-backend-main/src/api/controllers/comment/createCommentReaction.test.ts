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
import {Comment, User, Reaction} from '../../../models';
import routes from '../index';

const createCommentReaction = applySchemas(
  routes['/comments/:id/reactions'].post,
);

const createMocks = (commentId: string, userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {
      type: 'love',
    },
    params: {
      id: commentId,
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

describe('createCommentReaction', () => {
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

  describe('when comment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId(),
      );

      await createCommentReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Comment not found',
      });
    });
  });

  describe('when comment is found and creating a reaction succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        createdBy: user._id,
        content: 'This is a test comment',
      });

      mocks = createMocks(comment._id.toHexString(), user._id);

      await createCommentReaction(mocks.req, mocks.res);
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

  describe('when reaction to the same comment exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        createdBy: user._id,
        content: 'This is a test comment',
      });

      await Reaction.create({
        community: comment.community,
        rootTarget: comment.rootTarget,
        target: comment._id,
        createdBy: user._id,
        type: 'compassion',
      });
      mocks = createMocks(comment._id.toHexString(), user._id);

      await createCommentReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it updates the reaction', async () => {
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
});
