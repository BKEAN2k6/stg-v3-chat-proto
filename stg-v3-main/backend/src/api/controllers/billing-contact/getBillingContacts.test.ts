import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {createTestBillingContact} from '../../../test-utils/testDocuments.js';
import {BillingContact} from '../../../models/index.js';

const getBillingContactsRoute = applySchemas(routes['/billing-contacts'].get);

const createMocks = () =>
  createMocksAsync({
    method: 'GET',
  });

describe('getBillingContacts', () => {
  describe('when contacts exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await BillingContact.deleteMany({});
      await createTestBillingContact({name: 'Bravo Contact'});
      await createTestBillingContact({name: 'Alpha Contact'});

      mocks = createMocks();
      await getBillingContactsRoute(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns contacts sorted by name', () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        expect.objectContaining({name: 'Alpha Contact'}),
        expect.objectContaining({name: 'Bravo Contact'}),
      ]);
    });
  });

  describe('when a search query is provided', () => {
    it('returns contacts whose names start with the search term', async () => {
      await BillingContact.deleteMany({});
      await createTestBillingContact({name: 'First Contact'});
      await createTestBillingContact({name: 'Second Contact'});
      await createTestBillingContact({name: 'Another Contact'});

      const mocks = createMocks();
      mocks.req.query = {search: 'Sec Fir'};

      await getBillingContactsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        expect.objectContaining({name: 'First Contact'}),
        expect.objectContaining({name: 'Second Contact'}),
      ]);
    });

    it('limits the number of returned contacts', async () => {
      await BillingContact.deleteMany({});
      await createTestBillingContact({name: 'First Contact'});
      await createTestBillingContact({name: 'Second Contact'});

      const mocks = createMocks();
      mocks.req.query = {limit: '1'};

      await getBillingContactsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toHaveLength(1);
    });
  });

  describe('when requesting recent contacts', () => {
    it('orders contacts by latest update', async () => {
      await BillingContact.deleteMany({});
      const first = await createTestBillingContact({name: 'First Contact'});
      const second = await createTestBillingContact({name: 'Second Contact'});
      const third = await createTestBillingContact({name: 'Third Contact'});

      await BillingContact.updateOne(
        {_id: first._id},
        {$set: {updatedAt: new Date('2024-01-01T00:00:00.000Z')}},
        {timestamps: false},
      );
      await BillingContact.updateOne(
        {_id: second._id},
        {$set: {updatedAt: new Date('2024-01-03T00:00:00.000Z')}},
        {timestamps: false},
      );
      await BillingContact.updateOne(
        {_id: third._id},
        {$set: {updatedAt: new Date('2024-01-02T00:00:00.000Z')}},
        {timestamps: false},
      );

      const mocks = createMocks();
      mocks.req.query = {sort: 'recent'};

      await getBillingContactsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        expect.objectContaining({name: 'Second Contact'}),
        expect.objectContaining({name: 'Third Contact'}),
        expect.objectContaining({name: 'First Contact'}),
      ]);
    });

    it('defaults to returning the top 20 contacts', async () => {
      await BillingContact.deleteMany({});
      for (let index = 0; index < 25; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await createTestBillingContact({name: `Contact ${index}`});
      }

      const mocks = createMocks();
      mocks.req.query = {sort: 'recent'};

      await getBillingContactsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toHaveLength(20);
    });
  });
});
