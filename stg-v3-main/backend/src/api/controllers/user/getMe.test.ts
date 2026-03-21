import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Community, CommunityMembership} from '../../../models/index.js';
import routes from '../index.js';

const getMe = applySchemas(routes['/users/me'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: id.toJSON(),
    },
    retentionStats: {
      recordEvent: vi.fn(),
    },
  });

describe('getMe', () => {
  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when user is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        avatar: 'test-avatar.jpg',
        groups: [],
      });

      const user = await registerTestUser({
        roles: ['super-admin'],
      });

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'admin',
      });

      mocks = createMocks(user._id);

      await getMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test@test.com',
        language: 'en',
        avatar: 'test-avatar.jpg',
        roles: ['super-admin'],
        selectedCommunity: expect.any(String),
        communities: [
          {
            id: expect.any(String),
            name: 'Test Community',
            avatar: 'test-avatar.jpg',
            role: 'admin',
            memberCount: 1,
            subscriptionStatus: 'free-trial',
          },
        ],
        consents: {
          vimeo: false,
        },
        hasSetConsents: false,
      });
    });
  });
});
