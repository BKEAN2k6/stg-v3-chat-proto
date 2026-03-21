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

const updateBillingContactRoute = applySchemas(
  routes['/billing-contacts/:id'].patch,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {id: id.toJSON()},
    body,
  });

describe('updateBillingContact', () => {
  describe('when billing contact does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {name: 'Updated'});
      await updateBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Billing contact not found',
      });
    });
  });

  describe('when billing contact exists', () => {
    let mocks: Mocks<Request, Response>;
    let contactId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const contact = await createTestBillingContact({name: 'Original'});
      contactId = contact._id;

      mocks = createMocks(contactId, {
        name: 'Updated Name',
        crmLink: 'https://crm.example.com/contacts/updated',
        notes: 'Updated notes',
      });
      await updateBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the billing contact', () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual(
        expect.objectContaining({
          name: 'Updated Name',
          crmLink: 'https://crm.example.com/contacts/updated',
          notes: 'Updated notes',
        }),
      );
    });
  });
});
