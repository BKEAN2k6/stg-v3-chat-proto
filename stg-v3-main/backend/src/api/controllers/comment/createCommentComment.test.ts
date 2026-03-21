import {expect, it, describe, beforeEach, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Comment, User, UserImage} from '../../../models/index.js';
import routes from '../index.js';

const createCommentComment = applySchemas(
  routes['/comments/:id/comments'].post,
);

const createMocks = (
  postId: string,
  userId: mongoose.Types.ObjectId,
  imageId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    body: {
      content: 'This is a test comment',
      images: [imageId],
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

describe('createCommentComment', () => {
  describe('when comment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toJSON(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await createCommentComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Comment not found',
      });
    });
  });

  describe('when max comment level has been reached', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();
      const user = await registerTestUser({});
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: new mongoose.Types.ObjectId(),
        thumbnailImageUrl: `thumbnailImageUrl`,
        resizedImageUrl: `resizedImageUrl`,
        originalImageUrl: `originalImageUrl`,
        aspectRatio: 1,
      });

      const comment = await Comment.create({
        level: 2,
        content: 'This is a test comment',
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
        createdBy: user._id,
      });
      mocks = createMocks(comment._id.toJSON(), user._id, userImage._id);

      await createCommentComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with an error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Max comment level reached',
      });
    });
  });

  describe('when max comment count has been reached', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();
      const user = await registerTestUser({});
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: new mongoose.Types.ObjectId(),
        thumbnailImageUrl: `thumbnailImageUrl`,
        resizedImageUrl: `resizedImageUrl`,
        originalImageUrl: `originalImageUrl`,
        aspectRatio: 1,
      });

      const comment = await Comment.create({
        level: 0,
        content: 'This is a test comment',
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
        createdBy: user._id,
      });

      vi.spyOn(Comment, 'countDocuments').mockResolvedValueOnce(
        Comment.MAX_COMMENTS,
      );

      mocks = createMocks(comment._id.toJSON(), user._id, userImage._id);

      await createCommentComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with an error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Max comment count for thread reached',
      });
    });
  });

  describe('when creating a comment succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();
      const user = await registerTestUser({});
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: new mongoose.Types.ObjectId(),
        thumbnailImageUrl: `thumbnailImageUrl`,
        resizedImageUrl: `resizedImageUrl`,
        originalImageUrl: `originalImageUrl`,
        aspectRatio: 1,
      });

      const comment = await Comment.create({
        level: 0,
        content: 'This is a test comment',
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
        createdBy: user._id,
      });
      mocks = createMocks(comment._id.toJSON(), user._id, userImage._id);

      await createCommentComment(mocks.req, mocks.res);
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
        content: 'This is a test comment',
        images: [
          {
            id: expect.any(String),
            thumbnailImageUrl: `thumbnailImageUrl`,
            resizedImageUrl: `resizedImageUrl`,
            originalImageUrl: `originalImageUrl`,
            aspectRatio: 1,
          },
        ],
        comments: [],
        reactions: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
