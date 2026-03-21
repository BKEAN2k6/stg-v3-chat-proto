import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {createTestCommunity} from '../../../test-utils/testDocuments.js';
import {
  Community,
  BillingContact,
  BillingGroup,
} from '../../../models/index.js';
import routes from '../index.js';

const getCommunities = applySchemas(routes['/communities'].get);

const createMocks = ({
  search,
  limit,
  skip,
  sort,
  extra,
}: {
  search?: string;
  limit?: string;
  skip?: string;
  sort?: string;
  extra?: Record<string, string>;
} = {}) =>
  createMocksAsync({
    query: {
      search,
      skip,
      limit,
      sort,
      ...extra,
    },
  });

describe('getCommunities', () => {
  beforeEach(async () => {
    await Community.deleteMany({});

    await Community.create({
      name: '1 Test Community',
      description: '1 Test Community desctiption',
      avatar: 'test-avatar.jpg',
    });

    await Community.create({
      name: '2 Test Community',
      description: '2 Test Community desctiption',
      avatar: 'test-avatar.jpg',
    });

    await Community.create({
      name: '3 Test Community',
      description: '3 Test Community desctiption',
      avatar: 'test-avatar.jpg',
    });
  });

  describe('when query matches name', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({search: '1'});

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the found communities', async () => {
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });

  describe('with multiple search words', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({search: '1 2'});

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all matching results', async () => {
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(2);
      for (const community of data) {
        expect(community).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.stringContaining('Test Community'),
            description: expect.stringContaining('desctiption'),
            language: 'en',
            timezone: 'Etc/GMT',
            avatar: 'test-avatar.jpg',
          }),
        );
      }
    });
  });

  describe('with limit parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({search: '1 2', limit: '1'});

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it limits the number of results', async () => {
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });

  describe('with skip parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({search: '1 2', skip: '1', limit: '0'});

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it skips the number of results', async () => {
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });

  describe('with sort parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({
        search: '1 2',
        limit: '100',
        skip: '0',
        sort: '-name',
      });

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sorts the results', async () => {
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(2);
      expect(data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
      expect(data[1]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });

  describe('without search term', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks();

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all communities', async () => {
      const data = mocks.res._getJSONData() as Array<Record<string, unknown>>;
      expect(data).toHaveLength(3);
      for (const [index, community] of data.entries()) {
        expect(community).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: `${index + 1} Test Community`,
            description: `${index + 1} Test Community desctiption`,
            language: 'en',
            timezone: 'Etc/GMT',
            avatar: 'test-avatar.jpg',
          }),
        );
      }
    });
  });

  describe('when query matches subscriptionEnds', () => {
    let mocks: Mocks<Request, Response>;
    let billingGroup: any;

    beforeEach(async () => {
      const contact = await BillingContact.create({
        name: 'Test Contact',
        email: 'test@example.com',
      });
      billingGroup = await BillingGroup.create({
        name: 'Test Group',
        billingContact: contact._id,
      });

      // Community that should match (subscriptionEnds: false/undefined)
      await createTestCommunity({
        name: 'Expiring Community',
        billingGroup: billingGroup._id,
        subscription: {
          status: 'active-manual',
          statusValidUntil: new Date('2024-12-31T23:59:59Z'),
          subscriptionEnds: false,
        } as any,
      });

      // Community that should NOT match (subscriptionEnds: true)
      await createTestCommunity({
        name: 'Ending Community',
        billingGroup: billingGroup._id,
        subscription: {
          status: 'active-manual',
          statusValidUntil: new Date('2024-12-31T23:59:59Z'),
          subscriptionEnds: true,
        } as any,
      });

      mocks = createMocks({
        extra: {
          subscriptionEnds: 'false',
          status: 'active-manual',
        },
      });
      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with communities where subscriptionEnds is not true', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Expiring Community');
    });
  });
});
