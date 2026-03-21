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
import {Comment, User, UserImage} from '../../../models';
import routes from '../index';

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

describe('createCommentComment', () => {
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
      const user = await User.create({
        email: 'test1@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });
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
      mocks = createMocks(comment._id.toHexString(), user._id, userImage._id);

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
      const user = await User.create({
        email: 'test2@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });
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

      jest
        .spyOn(Comment, 'countDocuments')
        .mockResolvedValueOnce(Comment.MAX_COMMENTS);

      mocks = createMocks(comment._id.toHexString(), user._id, userImage._id);

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
      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });
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
      mocks = createMocks(comment._id.toHexString(), user._id, userImage._id);

      await createCommentComment(mocks.req, mocks.res);
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
        content: 'This is a test comment',
        images: [
          {
            _id: expect.any(String),
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
