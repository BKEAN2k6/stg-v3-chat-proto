import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {
  createTestBillingContact,
  createTestBillingGroup,
  createTestCommunity,
  registerTestUser,
} from '../../../test-utils/testDocuments.js';
import {Community} from '../../../models/index.js';

const updateBillingGroupSubscriptionRoute = applySchemas(
  routes['/billing-groups/:id/subscription'].patch,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
  userId?: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {id: id.toJSON()},
    body,
    user: {id: (userId ?? new mongoose.Types.ObjectId()).toJSON()},
  });

describe('updateBillingGroupSubscription', () => {
  describe('when billing group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {
        end: '2025-01-01T00:00:00Z',
      });

      await updateBillingGroupSubscriptionRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing group not found',
      });
    });
  });

  describe('when billing group exists', () => {
    let billingGroupId: mongoose.Types.ObjectId;
    let communityAId: mongoose.Types.ObjectId;
    let communityBId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const billingContact = await createTestBillingContact();
      const billingGroup = await createTestBillingGroup(billingContact._id);
      billingGroupId = billingGroup._id;

      const communityA = await createTestCommunity({
        name: 'Community A',
        billingGroup: billingGroup._id,
      });
      communityAId = communityA._id;

      const communityB = await createTestCommunity({
        name: 'Community B',
        billingGroup: billingGroup._id,
        subscription: {statusValidUntil: new Date('2024-01-01T00:00:00Z')},
      });
      communityBId = communityB._id;
    });

    it('updates subscriptions for all communities when ids omitted', async () => {
      const user = await registerTestUser({
        email: 'test-billing-admin@example.com',
      });
      const requestUser = user._id;
      const mocks = createMocks(
        billingGroupId,
        {
          statusValidUntil: '2025-03-31T00:00:00Z',
          status: 'active-online',
        },
        requestUser,
      );

      await updateBillingGroupSubscriptionRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.updatedCommunityIds).toEqual(
        expect.arrayContaining([communityAId.toJSON(), communityBId.toJSON()]),
      );
      expect(data.billingGroup.lastSubscriptionEnd).toBe(
        '2025-03-31T00:00:00.000Z',
      );
      expect(data.billingGroup.communities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: communityAId.toJSON(),
            subscriptionStatusValidUntil: '2025-03-31T00:00:00.000Z',
            subscriptionStatus: 'active-online',
            subscriptionUpdatedAt: expect.any(String),
            subscriptionUpdatedBy: expect.objectContaining({
              id: expect.any(String),
            }),
          }),
          expect.objectContaining({
            id: communityBId.toJSON(),
            subscriptionStatusValidUntil: '2025-03-31T00:00:00.000Z',
            subscriptionStatus: 'active-online',
            subscriptionUpdatedAt: expect.any(String),
            subscriptionUpdatedBy: expect.objectContaining({
              id: expect.any(String),
            }),
          }),
        ]),
      );

      const [communityA, communityB] = await Promise.all([
        Community.findById(communityAId),
        Community.findById(communityBId),
      ]);
      expect(communityA?.subscription?.statusValidUntil?.toISOString()).toBe(
        '2025-03-31T00:00:00.000Z',
      );
      expect(communityB?.subscription?.statusValidUntil?.toISOString()).toBe(
        '2025-03-31T00:00:00.000Z',
      );
      expect(communityA?.subscription?.status).toBe('active-online');
      expect(communityB?.subscription?.status).toBe('active-online');
      expect(communityA?.subscription?.updatedBy?.toString()).toBe(
        requestUser.toJSON(),
      );
      expect(communityB?.subscription?.updatedBy?.toString()).toBe(
        requestUser.toJSON(),
      );
    });

    it('updates only provided communities when ids are supplied', async () => {
      const user = await registerTestUser({
        email: 'test-billing-admin-2@example.com',
      });
      const requestUser = user._id;
      const mocks = createMocks(
        billingGroupId,
        {
          statusValidUntil: '2026-01-15T00:00:00Z',
          communityIds: [communityAId.toJSON()],
          status: 'grace',
        },
        requestUser,
      );

      await updateBillingGroupSubscriptionRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.updatedCommunityIds).toEqual([communityAId.toJSON()]);

      const [communityA, communityB] = await Promise.all([
        Community.findById(communityAId),
        Community.findById(communityBId),
      ]);
      expect(data.billingGroup.lastSubscriptionEnd).toBe(
        '2026-01-15T00:00:00.000Z',
      );
      expect(communityA?.subscription?.statusValidUntil?.toISOString()).toBe(
        '2026-01-15T00:00:00.000Z',
      );
      expect(communityA?.subscription?.status).toBe('grace');
      expect(communityB?.subscription?.statusValidUntil?.toISOString()).toBe(
        '2024-01-01T00:00:00.000Z',
      );
      expect(communityA?.subscription?.updatedAt).toBeInstanceOf(Date);
      expect(communityA?.subscription?.updatedBy?.toString()).toBe(
        requestUser.toJSON(),
      );
    });

    it('stores the end date even when no communities are updated', async () => {
      const mocks = createMocks(billingGroupId, {
        statusValidUntil: '2027-02-10T00:00:00Z',
        communityIds: [],
      });

      await updateBillingGroupSubscriptionRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.updatedCommunityIds).toEqual([]);
      expect(data.billingGroup.lastSubscriptionEnd).toBe(
        '2027-02-10T00:00:00.000Z',
      );

      const [communityA, communityB] = await Promise.all([
        Community.findById(communityAId),
        Community.findById(communityBId),
      ]);
      expect(communityA?.subscription?.statusValidUntil).toBeUndefined();
      expect(communityB?.subscription?.statusValidUntil?.toISOString()).toBe(
        '2024-01-01T00:00:00.000Z',
      );
    });
  });
});
