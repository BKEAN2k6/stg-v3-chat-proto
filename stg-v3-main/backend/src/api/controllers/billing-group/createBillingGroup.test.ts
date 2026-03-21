import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {createTestBillingContact} from '../../../test-utils/testDocuments.js';

const createBillingGroupRoute = applySchemas(routes['/billing-groups'].post);

const createMocks = (body: Record<string, unknown>) =>
  createMocksAsync({
    body,
  });

describe('createBillingGroup', () => {
  describe('when billing contact does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({
        name: 'Manual Renewals',
        billingContactId: new mongoose.Types.ObjectId().toJSON(),
      });

      await createBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing contact not found',
      });
    });
  });

  describe('when payload is valid', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const contact = await createTestBillingContact({
        name: 'Primary Contact',
      });

      mocks = createMocks({
        name: 'Manual Renewals',
        notes: 'Handle all manual invoices',
        billingContactId: contact._id.toJSON(),
      });

      await createBillingGroupRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('creates the billing group with populated contact', () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        name: 'Manual Renewals',
        notes: 'Handle all manual invoices',
        billingContact: expect.objectContaining({
          id: expect.any(String),
          name: 'Primary Contact',
        }),
        communities: [],
      });
    });
  });
});
