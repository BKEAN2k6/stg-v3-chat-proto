import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Community, UserImage} from '../../../models/index.js';
import routes from '../index.js';

const createCommunityMoment = applySchemas(
  routes['/communities/:id/moments'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
) =>
  createMocksAsync({
    body,
    params: {
      id: id.toJSON(),
    },
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
    events: {
      emit: vi.fn(),
    },
  });

describe('createCommunityMoment', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      vi.spyOn(Community, 'findById').mockResolvedValueOnce(null);
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        {},
      );
      await createCommunityMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('creating a moment succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });
      const userImage = await UserImage.create({
        createdBy: user._id,
        community: community._id,
        originalImageUrl: 'test-original-image.jpg',
        resizedImageUrl: 'test-resized-image.jpg',
        thumbnailImageUrl: 'test-thumbnail-image.jpg',
        aspectRatio: 1,
      });

      mocks = createMocks(community._id, user._id, {
        content: 'This is a test moment',
        images: [userImage._id.toJSON()],
        strengths: ['love'],
      });

      await createCommunityMoment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the moment data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        postType: 'moment',
        comments: [],
        reactions: [],
        createdBy: {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        images: [
          {
            id: expect.any(String),
            originalImageUrl: 'test-original-image.jpg',
            resizedImageUrl: 'test-resized-image.jpg',
            thumbnailImageUrl: 'test-thumbnail-image.jpg',
            aspectRatio: 1,
          },
        ],
        strengths: ['love'],
        content: 'This is a test moment',

        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
