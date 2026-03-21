import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Moment, UserImage} from '../../../models/index.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import momentRoutes from '../index.js';

const updateMoment = applySchemas(momentRoutes['/moments/:id'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  imageId: mongoose.Types.ObjectId,
) => {
  return createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      content: 'Test moment updated content',
      images: [imageId.toJSON()],
      strengths: ['gratitude'],
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
};

describe('updateMoment', () => {
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
      const user = await registerTestUser({});

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
        id: expect.any(String),
        postType: 'moment',
        content: 'Test moment updated content',
        strengths: ['gratitude'],
        images: [
          {
            id: expect.any(String),
            originalImageUrl: 'testOriginalImageUrl.jpg',
            resizedImageUrl: 'testResizedImageUrl.jpg',
            thumbnailImageUrl: 'testThumbnailImageUrl.jpg',
            aspectRatio: 1,
          },
        ],
        comments: [],
        reactions: [],
        createdBy: {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
