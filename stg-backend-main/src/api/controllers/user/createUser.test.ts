import {
  jest,
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {User} from '../../../models';
import routes from '../index';

const createUser = applySchemas(routes['/users'].post);

const createMocks = (body: Record<string, unknown>) =>
  createMocksAsync({
    body,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createUser', () => {
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

  describe('when user with the given email already exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.create({
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        language: 'en',
      });

      mocks = createMocks({
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        language: 'en',
      });

      await createUser(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "User with a given email already exists" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User with a given email already exists',
      });
    });
  });
});
