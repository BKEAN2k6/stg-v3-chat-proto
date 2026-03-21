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
} from '../../../test-utils/testDocuments.js';
import {Community} from '../../../models/index.js';

const updateCommunityBillingGroupRoute = applySchemas(
  routes['/communities/:id/billing-group'].patch,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {id: id.toJSON()},
    body,
  });

describe('updateCommunityBillingGroup', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {
        billingGroupId: null,
      });

      await updateCommunityBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when billing group does not exist', () => {
    let mocks: Mocks<Request, Response>;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await createTestCommunity();
      communityId = community._id;

      mocks = createMocks(communityId, {
        billingGroupId: new mongoose.Types.ObjectId().toJSON(),
      });

      await updateCommunityBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing group not found',
      });
    });
  });

  describe('when assigning and removing billing group', () => {
    let communityId: mongoose.Types.ObjectId;
    let billingGroupId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const billingContact = await createTestBillingContact();
      const billingGroup = await createTestBillingGroup(billingContact._id);
      billingGroupId = billingGroup._id;
      const community = await createTestCommunity();
      communityId = community._id;
    });

    it('assigns the billing group to the community', async () => {
      const mocks = createMocks(communityId, {
        billingGroupId: billingGroupId.toJSON(),
      });

      await updateCommunityBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual(
        expect.objectContaining({
          id: communityId.toJSON(),
          billingGroup: billingGroupId.toJSON(),
        }),
      );

      const updated = await Community.findById(communityId);
      expect(updated?.billingGroup?.toString()).toBe(billingGroupId.toJSON());
    });

    it('removes the billing group when null is provided', async () => {
      await Community.updateOne(
        {_id: communityId},
        {billingGroup: billingGroupId},
      );

      const mocks = createMocks(communityId, {
        billingGroupId: null,
      });

      await updateCommunityBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      const responseBody = mocks.res._getJSONData();
      expect(responseBody.id).toBe(communityId.toJSON());
      expect(responseBody.billingGroup).toBeUndefined();

      const updated = await Community.findById(communityId);
      expect(updated?.billingGroup).toBeUndefined();
    });
  });
});
