import {describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {
  createTestBillingContact,
  createTestBillingGroup,
} from '../../../test-utils/testDocuments.js';
import {BillingGroup} from '../../../models/index.js';

const getBillingGroupsRoute = applySchemas(routes['/billing-groups'].get);

const createMocks = () =>
  createMocksAsync({
    method: 'GET',
  });

describe('getBillingGroups', () => {
  it('returns billing groups sorted by name', async () => {
    const contact = await createTestBillingContact();
    await createTestBillingGroup(contact._id, {name: 'Zulu Group'});
    await createTestBillingGroup(contact._id, {name: 'Alpha Group'});

    const mocks = createMocks();
    await getBillingGroupsRoute(mocks.req, mocks.res);
    await mocks.result;

    expect(mocks.res.statusCode).toBe(200);
    expect(mocks.res._getJSONData()).toEqual([
      expect.objectContaining({name: 'Alpha Group'}),
      expect.objectContaining({name: 'Zulu Group'}),
    ]);
  });

  it('filters billing groups by search term and applies limit', async () => {
    const contact = await createTestBillingContact();
    await BillingGroup.deleteMany({});
    await createTestBillingGroup(contact._id, {name: 'North Group'});
    await createTestBillingGroup(contact._id, {name: 'South Group'});
    await createTestBillingGroup(contact._id, {name: 'West Group'});

    const mocks: Mocks<Request, Response> = createMocks();
    mocks.req.query = {search: 'South Nor', limit: '1'};

    await getBillingGroupsRoute(mocks.req, mocks.res);
    await mocks.result;

    expect(mocks.res.statusCode).toBe(200);
    const data = mocks.res._getJSONData();
    expect(data).toHaveLength(1);
    expect(data[0]).toEqual(expect.objectContaining({name: 'North Group'}));
  });

  describe('when requesting recent groups', () => {
    it('returns groups ordered by last update', async () => {
      await BillingGroup.deleteMany({});
      const contact = await createTestBillingContact();
      const north = await createTestBillingGroup(contact._id, {
        name: 'North Group',
      });
      const south = await createTestBillingGroup(contact._id, {
        name: 'South Group',
      });
      const east = await createTestBillingGroup(contact._id, {
        name: 'East Group',
      });

      await BillingGroup.updateOne(
        {_id: north._id},
        {$set: {updatedAt: new Date('2024-01-05T00:00:00.000Z')}},
        {timestamps: false},
      );
      await BillingGroup.updateOne(
        {_id: south._id},
        {$set: {updatedAt: new Date('2024-01-10T00:00:00.000Z')}},
        {timestamps: false},
      );
      await BillingGroup.updateOne(
        {_id: east._id},
        {$set: {updatedAt: new Date('2024-01-08T00:00:00.000Z')}},
        {timestamps: false},
      );

      const mocks = createMocks();
      mocks.req.query = {sort: 'recent'};

      await getBillingGroupsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        expect.objectContaining({name: 'South Group'}),
        expect.objectContaining({name: 'East Group'}),
        expect.objectContaining({name: 'North Group'}),
      ]);
    });

    it('defaults to twenty results when no limit is provided', async () => {
      await BillingGroup.deleteMany({});
      const contact = await createTestBillingContact();
      for (let index = 0; index < 23; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await createTestBillingGroup(contact._id, {name: `Group ${index}`});
      }

      const mocks = createMocks();
      mocks.req.query = {sort: 'recent'};

      await getBillingGroupsRoute(mocks.req, mocks.res);
      await mocks.result;

      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toHaveLength(20);
    });
  });
});
