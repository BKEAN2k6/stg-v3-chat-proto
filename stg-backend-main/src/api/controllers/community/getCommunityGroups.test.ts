import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {Community, Group} from '../../../models';
import routes from '../index';

const getCommunityGroups = applySchemas(routes['/communities/:id/groups'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getCommunityGroups', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mongoose.connect(global.__MONGO_URI__, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dbName: global.__MONGO_DB_NAME__,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getCommunityGroups(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = new Group({
        name: 'Test group',
        description: 'This is a test group',
      });

      const community = new Community({
        name: 'Test community',
        description: 'This is a test community',
        groups: [group],
      });

      group.community = community;
      await group.save();
      await community.save();

      mocks = createMocks(community._id);

      await getCommunityGroups(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community groups', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          description: 'This is a test group',
          name: 'Test group',
        },
      ]);
    });
  });
});
