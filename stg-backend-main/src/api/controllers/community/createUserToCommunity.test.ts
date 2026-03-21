import {
  expect,
  it,
  describe,
  beforeEach,
  afterEach,
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
import {User} from '../../../models';
import magicLogin from '../../../passport/magic-login';
import routes from '../index';

const createUserToCommunity = applySchemas(
  routes['/communities/:id/users'].post,
);

const createMocks = () =>
  createMocksAsync({
    params: {
      id: 'testCommunity-id',
    },
    body: {
      destination: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      language: 'en',
      role: 'member',
    },
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    logger: {
      log: jest.fn(),
    },
  });

describe('createUserToCommunity', () => {
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

  describe('when a user with the same email exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.create({
        firstName: 'User',
        lastName: 'Test',
        email: 'test@test.com',
      });
      mocks = createMocks();

      await createUserToCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    afterEach(async () => {
      await User.deleteMany();
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User with a given email already exists',
      });
    });
  });

  describe('when a user with the same email is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      jest
        .spyOn(magicLogin, 'send')
        .mockImplementationOnce((request, response) =>
          response.sendStatus(200),
        );

      mocks = createMocks();

      await createUserToCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it calls magicLogin send with the request and response', async () => {
      expect(magicLogin.send).toHaveBeenCalledWith(mocks.req, mocks.res);
    });
  });
});
