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
} from '../../../test-utils/testDocuments.js';

const removeBillingContactRoute = applySchemas(
  routes['/billing-contacts/:id'].delete,
);

const createMocks = (id: mongoose.Types.ObjectId | string) =>
  createMocksAsync({
    params: {id: id.toString()},
  });

describe('removeBillingContact', () => {
  describe('when contact does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());
      await removeBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing contact not found',
      });
    });
  });

  describe('when contact has billing groups', () => {
    let mocks: Mocks<Request, Response>;
    let contactId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const contact = await createTestBillingContact();
      contactId = contact._id;
      await createTestBillingGroup(contact._id);

      mocks = createMocks(contactId);
      await removeBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error:
          'Billing contact cannot be removed while it is linked to billing groups',
      });
    });
  });

  describe('when contact has no billing groups', () => {
    let mocks: Mocks<Request, Response>;
    let contactId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const contact = await createTestBillingContact();
      contactId = contact._id;

      mocks = createMocks(contactId);
      await removeBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('deletes the contact and responds with no content', () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
