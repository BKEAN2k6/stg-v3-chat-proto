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
import routes from '../index';

const createCommunity = applySchemas(routes['/communities'].post);

const createMocks = () =>
  createMocksAsync({
    body: {
      name: 'Test Community',
      description: 'This is a test community',
      language: 'en',
      timezone: 'Europe/Helsinki',
    },
    user: {
      _id: new mongoose.Types.ObjectId(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('createCommunity', () => {
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

  describe('when saving community succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks();

      await createCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the community data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        name: 'Test Community',
        language: 'en',
        description: 'This is a test community',
        timezone: 'Europe/Helsinki',
        avatar: '',
      });
    });
  });
});
