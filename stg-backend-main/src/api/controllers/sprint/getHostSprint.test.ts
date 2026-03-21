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
import {Sprint} from '../../../models';
import routes from '../index';

const getHostSprint = applySchemas(routes['/sprints/:id/host'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getHostSprint', () => {
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

  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getHostSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when sprint is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });
      mocks = createMocks(sprint._id);

      await getHostSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isStarted: false,
        isEnded: false,
        sharedStrengths: [],
        players: [],
        code: expect.any(String),
        isCompleted: false,
        expectedStrengthCount: 0,
      });
    });
  });
});
