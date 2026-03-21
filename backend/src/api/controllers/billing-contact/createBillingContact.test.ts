import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';

const createBillingContactRoute = applySchemas(
  routes['/billing-contacts'].post,
);

const createMocks = (body: Record<string, unknown>) =>
  createMocksAsync({
    body,
  });

describe('createBillingContact', () => {
  describe('when payload is valid', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({
        name: 'Acme Billing',
        email: 'billing@acme.test',
        crmLink: 'https://crm.example.com/contacts/1',
        notes: 'Primary contact',
      });

      await createBillingContactRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('creates the billing contact and returns it', () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        name: 'Acme Billing',
        email: 'billing@acme.test',
        crmLink: 'https://crm.example.com/contacts/1',
        notes: 'Primary contact',
      });
    });
  });
});
