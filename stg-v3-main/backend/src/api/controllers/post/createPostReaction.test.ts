import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Moment, User, Reaction} from '../../../models/index.js';
import routes from '../index.js';

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
      id: userId.toJSON(),
    },
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
      getCommunityStats: vi.fn(),
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('createPostReaction', () => {
  describe('when post is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toJSON(),
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
      const user = await registerTestUser({});
      mocks = createMocks(moment._id.toJSON(), user._id);

      await createPostReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        createdBy: {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
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
      const user = await registerTestUser({});

      await Reaction.create({
        rootTarget: moment._id,
        target: moment._id,
        community: moment.community,
        createdBy: user._id,
        type: 'compassion',
      });
      mocks = createMocks(moment._id.toJSON(), user._id);

      await createPostReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the reaction', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        createdBy: {
          id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        type: 'love',
      });
    });
  });
});
