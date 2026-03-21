import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {applySchemas} from '../../../test-utils/applySchemas';
import {User} from '../../../models';
import routes from '../index';

const checkEmailExists = applySchemas(routes['/check-email'].post);

const createMocks = (email: string) =>
  createMocksAsync({
    body: {
      email,
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('checkEmailExists', () => {
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

  describe('when user exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.create({
        email: 'existing@example.com',
      });

      mocks = createMocks('existing@example.com');

      await checkEmailExists(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds true for exists', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({exists: true});
    });
  });

  describe('when user does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('nonexistent@example.com');

      await checkEmailExists(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds false for exists', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({exists: false});
    });
  });
});
