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
import {Community} from '../../../models';
import routes from '../index';

const createCommunitySprint = applySchemas(
  routes['/communities/:id/sprints'].post,
);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {},
    params: {
      id: id.toHexString(),
    },
    user: {
      _id: new mongoose.Types.ObjectId(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('createCommunitySprint', () => {
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

  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await createCommunitySprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when group exists and creating a sprint succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });
      mocks = createMocks(community._id);

      await createCommunitySprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        code: expect.any(String),
      });
    });
  });
});
