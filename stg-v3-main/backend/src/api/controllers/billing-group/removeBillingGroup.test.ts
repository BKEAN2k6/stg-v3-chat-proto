import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {
  createTestBillingContact,
  createTestBillingGroup,
  createTestCommunity,
} from '../../../test-utils/testDocuments.js';

const removeBillingGroupRoute = applySchemas(
  routes['/billing-groups/:id'].delete,
);

const createMocks = (id: mongoose.Types.ObjectId | string) =>
  createMocksAsync({
    params: {id: id.toString()},
  });

describe('removeBillingGroup', () => {
  describe('when billing group does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());
      await removeBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing group not found',
      });
    });
  });

  describe('when billing group has communities', () => {
    let mocks: Mocks<Request, Response>;
    let groupId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const contact = await createTestBillingContact();
      const group = await createTestBillingGroup(contact._id);
      groupId = group._id;
      await createTestCommunity({billingGroup: group._id});

      mocks = createMocks(groupId);
      await removeBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing group cannot be removed while it has communities',
      });
    });
  });

  describe('when billing group has no communities', () => {
    let mocks: Mocks<Request, Response>;
    let groupId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const contact = await createTestBillingContact();
      const group = await createTestBillingGroup(contact._id);
      groupId = group._id;

      mocks = createMocks(groupId);
      await removeBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('removes the group and responds with no content', () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
