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
import {Group} from '../../../models';
import routes from '../index';

const updateGroup = applySchemas(routes['/groups/:id'].put);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body: {
      name: 'Updated test group name',
      description: 'Updated test group description',
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('updateGroup', () => {
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

      await updateGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await Group.create({
        community: new mongoose.Types.ObjectId(),
        name: 'Test group name',
        description: 'Test group description',
      });
      mocks = createMocks(group._id);

      await updateGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the updated group data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        name: 'Updated test group name',
        description: 'Updated test group description',
      });
    });
  });
});
