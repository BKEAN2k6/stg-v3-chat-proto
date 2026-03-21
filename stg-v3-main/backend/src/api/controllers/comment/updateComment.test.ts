import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Comment, UserImage, Reaction} from '../../../models/index.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const updateComment = applySchemas(routes['/comments/:id'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  imageId: mongoose.Types.ObjectId,
) => {
  return createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      content: 'Test comment updated content',
      images: [imageId.toJSON()],
    },
    events: {
      emit: vi.fn(),
    },
  });
};

describe('updateComment', () => {
  describe('when commment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await updateComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Comment not found',
      });
    });
  });

  describe('when comment is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const rootTarget = new mongoose.Types.ObjectId();

      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        content: 'Test comment content',
        createdBy: user._id,
        target: new mongoose.Types.ObjectId(),
        rootTarget,
      });

      const commentComment = await Comment.create({
        level: 1,
        community: new mongoose.Types.ObjectId(),
        content: 'Test comment comment content',
        createdBy: user._id,
        target: comment._id,
        rootTarget,
      });

      const userImage = await UserImage.create({
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
        thumbnailImageUrl: 'testThumbnailImage.jpg',
        resizedImageUrl: 'testResizedImage.jpg',
        originalImageUrl: 'testOriginalImage.jpg',
        aspectRatio: 1,
      });

      await Reaction.create({
        type: 'love',
        rootTarget,
        target: comment._id,
        createdBy: user._id,
        community: comment.community,
      });

      await Reaction.create({
        type: 'compassion',
        rootTarget,
        target: commentComment._id,
        createdBy: user._id,
        community: commentComment.community,
      });

      mocks = createMocks(comment._id, userImage._id);
      await updateComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the comment data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        createdBy: {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        content: 'Test comment updated content',
        images: [
          {
            id: expect.any(String),
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
            id: expect.any(String),
            createdBy: {
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        comments: [
          {
            id: expect.any(String),
            createdBy: {
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'Test comment comment content',
            images: [],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [
              {
                id: expect.any(String),
                createdBy: {
                  id: expect.any(String),
                  firstName: 'TestFirstName',
                  lastName: 'TestLastName',
                  avatar: 'test-avatar.jpg',
                },
                type: 'compassion',
                createdAt: expect.any(String),
              },
            ],
            comments: [],
          },
        ],
      });
    });
  });
});
