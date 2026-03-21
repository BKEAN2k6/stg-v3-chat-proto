import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {Request, Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Comment, User, Reaction} from '../../../models/index.js';
import routes from '../index.js';

const createCommentReaction = applySchemas(
  routes['/comments/:id/reactions'].post,
);

const createMocks = (commentId: string, userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {type: 'love'},
    params: {id: commentId},
    user: {
      id: userId.toJSON(),
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      avatar: 'test-avatar.jpg',
    },
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
      getCommunityStats: vi.fn(),
    },
    events: {emit: vi.fn()},
  });

describe('createCommentReaction', () => {
  describe('when comment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toJSON(),
        new mongoose.Types.ObjectId(),
      );

      await createCommentReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
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

      const user = await registerTestUser({});

      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        createdBy: user._id,
        content: 'This is a test comment',
      });

      mocks = createMocks(comment._id.toJSON(), user._id);

      await createCommentReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', () => {
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

  describe('when reaction to the same comment exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await registerTestUser({});

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

      mocks = createMocks(comment._id.toJSON(), user._id);

      await createCommentReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the reaction', () => {
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
});
