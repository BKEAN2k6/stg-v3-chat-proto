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
import {User} from '../../../models';
import routes from '../index';

const updateUser = applySchemas(routes['/users/:id'].patch);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body: {
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      password: 'updatedPassword',
      email: 'updated@test.email',
      language: 'fi',
      isEmailVerified: true,
      roles: ['super-admin'],
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('updateUser', () => {
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

  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateUser(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when user is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@test.com',
          language: 'en',
          roles: ['test-role'],
        },
        'oldPassword',
      );

      mocks = createMocks(user._id);
      await updateUser(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the updated user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        email: 'updated@test.email',
        language: 'fi',
        isEmailVerified: true,
        roles: ['super-admin'],
      });
    });
  });
});
