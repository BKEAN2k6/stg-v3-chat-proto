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
import {Community} from '../../../models';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const createCommunityGroup = applySchemas(
  routes['/communities/:id/groups'].post,
);

const createMocks = () =>
  createMocksAsync({
    body: {
      name: 'Test group',
      description: 'This is a test group',
    },
    params: {
      id: new mongoose.Types.ObjectId().toHexString,
    },
    user: {
      _id: new mongoose.Types.ObjectId(),
      save: jest.fn(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('createCommunityGroup', () => {
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
      jest.spyOn(Community, 'findById').mockResolvedValueOnce(null);
      mocks = createMocks();

      await createCommunityGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found and creating a group succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      jest.spyOn(Community, 'findById').mockResolvedValueOnce({
        groups: [],
        _id: new mongoose.Types.ObjectId(),
        save: jest.fn(),
      });

      mocks = createMocks();
      await createCommunityGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        description: 'This is a test group',
        name: 'Test group',
      });
    });
  });
});
