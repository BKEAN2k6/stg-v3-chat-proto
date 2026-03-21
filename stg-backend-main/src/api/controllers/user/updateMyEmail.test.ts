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
import magicLogin from '../../../passport/magic-login';
import routes from '../index';

const updateMyEmail = applySchemas(routes['/users/me/email'].put);

magicLogin.sendConfirmNewEmail = jest.fn(async () => {
  return 'confirmation-code';
});

const createMocks = (
  body: Record<string, unknown>,
  user?: Partial<{id: string; firstName: string; authenticate: jest.Mock}>,
) =>
  createMocksAsync({
    body,
    user,
    logger: {
      log: jest.fn(),
    },
  });

jest.mock('../../../passport/magic-login');

describe('updateMyEmail', () => {
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

  describe('when the user is not authenticated', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks({
        email: 'new-email@example.com',
        password: 'password',
      });

      await updateMyEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 401 with "Unauthorized" error', async () => {
      expect(mocks.res.statusCode).toBe(401);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Unauthorized',
      });
    });
  });

  describe('when the password is incorrect', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        id: userId.toHexString(),
        firstName: 'Test',
        authenticate: jest
          .fn<() => Promise<{error: string}>>()
          .mockResolvedValue({error: 'Password is incorrect'}),
      };

      mocks = createMocks(
        {email: 'new-email@example.com', password: 'wrong-password'},
        mockUser,
      );

      await updateMyEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "Password is incorrect" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Password is incorrect',
      });
    });
  });

  describe('when a user with the given email already exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.create({
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
      });

      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        id: userId.toHexString(),
        firstName: 'Test',
        authenticate: jest
          .fn<() => Promise<{error?: string}>>()
          .mockResolvedValue({}),
      };

      mocks = createMocks(
        {email: 'existing@example.com', password: 'password'},
        mockUser,
      );

      await updateMyEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "User with a given email already exists" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User with a given email already exists',
      });
    });
  });

  describe('when the email update is successful', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        id: userId.toHexString(),
        firstName: 'Test',
        authenticate: jest
          .fn<() => Promise<{error?: string}>>()
          .mockResolvedValue({}),
      };

      mocks = createMocks(
        {email: 'new-email@example.com', password: 'password'},
        mockUser,
      );

      await updateMyEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and sends confirmation code', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        code: 'confirmation-code',
      });
    });
  });
});
