import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createTestCommunity,
  registerTestUser,
} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const getCommunitySubscription = applySchemas(
  routes['/communities/:id/subscription'].get,
);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getCommunitySubscription', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());
      await getCommunitySubscription(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      await getCommunitySubscription(mocks.req, mocks.res);

      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });
});

describe('when community is found', () => {
  describe('when subscription is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await createTestCommunity();

      mocks = createMocks(community._id);
      await getCommunitySubscription(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the empty subscription data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        history: [],
      });
    });
  });
  describe('when subscription is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});
      const community = await createTestCommunity({
        subscription: {
          statusValidUntil: new Date('2024-12-31T23:59:59Z'),
          updatedAt: new Date('2024-12-30T00:00:00Z'),
          updatedBy: user._id,
          status: 'active-online',
        } as any,
      });

      mocks = createMocks(community._id);
      await getCommunitySubscription(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the subscription data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        statusValidUntil: '2024-12-31T23:59:59.000Z',
        status: 'active-online',
        subscriptionEnds: false,
        updatedAt: '2024-12-30T00:00:00.000Z',
        updatedBy: {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        history: [],
      });
    });
  });
});
