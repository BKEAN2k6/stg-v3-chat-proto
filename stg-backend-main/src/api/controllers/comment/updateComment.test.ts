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
import {Comment, User, UserImage, Reaction} from '../../../models';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const updateComment = applySchemas(routes['/comments/:id'].patch);

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
      content: 'Test comment updated content',
      images: [imageId.toHexString()],
    },
    events: {
      emit: jest.fn(),
    },
  });
};

describe('updateComment', () => {
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
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        avatar: 'testProfileImage.jpg',
      });

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
        _id: expect.any(String),
        createdBy: {
          _id: expect.any(String),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        content: 'Test comment updated content',
        images: [
          {
            _id: expect.any(String),
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
            _id: expect.any(String),
            createdBy: {
              _id: expect.any(String),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        comments: [
          {
            _id: expect.any(String),
            createdBy: {
              _id: expect.any(String),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'Test comment comment content',
            images: [],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [
              {
                _id: expect.any(String),
                createdBy: {
                  _id: expect.any(String),
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: 'testProfileImage.jpg',
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
