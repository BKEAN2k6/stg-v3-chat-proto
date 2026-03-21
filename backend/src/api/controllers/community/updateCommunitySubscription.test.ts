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
import {Community} from '../../../models/index.js';
import routes from '../index.js';

const updateCommunitySubscription = applySchemas(
  routes['/communities/:id/subscription'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
  userId?: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {id: id.toJSON()},
    body,
    method: 'POST',
    user: {id: (userId ?? new mongoose.Types.ObjectId()).toJSON()},
  });

describe('updateCommunitySubscription', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const missingId = new mongoose.Types.ObjectId();
      mocks = createMocks(missingId, {
        statusValidUntil: '2025-12-31T23:59:59Z',
      });
      await updateCommunitySubscription(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found', () => {
    describe('with valid end date and no existing subscription', () => {
      let mocks: Mocks<Request, Response>;
      let communityId: mongoose.Types.ObjectId;
      let userId: mongoose.Types.ObjectId;

      beforeEach(async () => {
        const user = await registerTestUser({});
        userId = user._id;
        const community = await createTestCommunity(); // No subscription by default
        communityId = community._id;

        mocks = createMocks(
          communityId,
          {
            statusValidUntil: '2024-12-31T23:59:59Z',
          },
          userId,
        );
        await updateCommunitySubscription(mocks.req, mocks.res);
        await mocks.result;
      });

      it('creates subscription and returns updated value', async () => {
        expect(mocks.res.statusCode).toBe(200);
        expect(mocks.res._getJSONData()).toEqual({
          statusValidUntil: '2024-12-31T23:59:59.000Z',
          status: 'free-trial',
          subscriptionEnds: false,
          updatedAt: expect.any(String),
          updatedBy: {
            id: userId.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
          history: [],
        });

        // Verify persisted in DB
        const updated = await Community.findById(communityId).select([
          'subscription',
          'subscriptionHistory',
        ]);
        const subscriptionEnd = updated?.subscription?.statusValidUntil;
        expect(subscriptionEnd?.toISOString()).toBe('2024-12-31T23:59:59.000Z');
        expect(updated?.subscription?.updatedAt).toBeInstanceOf(Date);
        expect(updated?.subscription?.updatedBy?.toString()).toBe(
          userId.toJSON(),
        );
        expect(updated?.subscription?.status).toBe('free-trial');
        expect(updated?.subscriptionHistory?.length).toBe(0);
      });
    });

    describe('with valid end date and existing subscription', () => {
      let mocks: Mocks<Request, Response>;
      let communityId: mongoose.Types.ObjectId;
      let userId: mongoose.Types.ObjectId;

      beforeEach(async () => {
        const user = await registerTestUser({
          email: 'test-unique-2@example.com',
        });
        userId = user._id;
        const community = await createTestCommunity({
          subscription: {
            statusValidUntil: new Date('2024-06-01T00:00:00Z'),
            status: 'grace',
          },
        });
        communityId = community._id;

        mocks = createMocks(
          communityId,
          {
            statusValidUntil: '2025-01-15T12:34:56Z',
            status: 'active-manual',
          },
          userId,
        );
        await updateCommunitySubscription(mocks.req, mocks.res);
        await mocks.result;
      });

      it('updates the subscription end and returns it', async () => {
        expect(mocks.res.statusCode).toBe(200);
        expect(mocks.res._getJSONData()).toEqual({
          statusValidUntil: '2025-01-15T12:34:56.000Z',
          status: 'active-manual',
          subscriptionEnds: false,
          updatedAt: expect.any(String),
          updatedBy: {
            id: userId.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
          history: [
            {
              statusValidUntil: '2024-06-01T00:00:00.000Z',
              status: 'grace',
              subscriptionEnds: false,
            },
          ],
        });

        const updated = await Community.findById(communityId).select([
          'subscription',
          'subscriptionHistory',
        ]);
        const subscriptionEnd = updated?.subscription?.statusValidUntil;
        expect(subscriptionEnd?.toISOString()).toBe('2025-01-15T12:34:56.000Z');
        expect(updated?.subscription?.updatedBy?.toString()).toBe(
          userId.toJSON(),
        );
        expect(updated?.subscription?.status).toBe('active-manual');
        expect(updated?.subscriptionHistory?.length).toBe(1);
        const historyEnd = updated?.subscriptionHistory?.[0]?.statusValidUntil;
        expect(historyEnd?.toISOString()).toBe('2024-06-01T00:00:00.000Z');
        expect(updated?.subscriptionHistory?.[0]?.status).toBe('grace');
      });
    });
  });
});
