import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Moment, UserImage, Comment, User} from '../../../models/index.js';
import routes from '../index.js';

const createPostComment = applySchemas(routes['/posts/:id/comments'].post);

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

describe('createPostComment', () => {
  describe('when post is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toJSON(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await createPostComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Post not found',
      });
    });
  });

  describe('when max comment count has been reached', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const moment = await Moment.create({
        content: 'This is a test moment',
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      const user = await registerTestUser({});
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: moment.community,
        thumbnailImageUrl: `thumbnailImageUrl`,
        resizedImageUrl: `resizedImageUrl`,
        originalImageUrl: `originalImageUrl`,
        aspectRatio: 1,
      });

      vi.spyOn(Comment, 'countDocuments').mockResolvedValueOnce(
        Comment.MAX_COMMENTS,
      );
      mocks = createMocks(moment._id.toJSON(), user._id, userImage._id);

      await createPostComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with an error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Max comment count for thread reached',
      });
    });
  });

  describe('when post is found and creating a comment succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      const moment = await Moment.create({
        content: 'This is a test moment',
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      const user = await registerTestUser({});
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: moment.community,
        thumbnailImageUrl: `thumbnailImageUrl`,
        resizedImageUrl: `resizedImageUrl`,
        originalImageUrl: `originalImageUrl`,
        aspectRatio: 1,
      });
      mocks = createMocks(moment._id.toJSON(), user._id, userImage._id);

      await createPostComment(mocks.req, mocks.res);
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
        reactions: [],
        comments: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
