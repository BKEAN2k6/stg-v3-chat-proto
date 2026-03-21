import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {createTestCommunity} from '../../../test-utils/testDocuments.js';

const createCommunityInvitation = applySchemas(
  routes['/communities/:id/invitations'].post,
);

const createMocks = (communityId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {
      name: 'Test group',
      description: 'This is a test group',
    },
    params: {
      id: communityId.toJSON(),
    },
    user: {
      _id: new mongoose.Types.ObjectId(),
      save: vi.fn(),
    },
  });

describe('createCommunityInvitation', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await createCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found and creating a community invitation succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await createTestCommunity(
        new mongoose.Types.ObjectId(),
      );
      mocks = createMocks(community._id);
      await createCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        code: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });
});
