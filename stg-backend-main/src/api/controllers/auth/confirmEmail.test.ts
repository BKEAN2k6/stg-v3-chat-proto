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

const confirmEmail = applySchemas(routes['/confirm-email'].post);

const createMocks = (
  body: Record<string, unknown>,
  logInCallback: (
    user: any,
    callback: (error: Error | undefined) => void,
  ) => void,
) =>
  createMocksAsync({
    body,
    logger: {
      log: jest.fn(),
    },
    logIn: logInCallback,
  });

magicLogin.decodeToken = jest.fn();

describe('confirmEmail', () => {
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

  describe('when the token is invalid', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      (magicLogin.decodeToken as jest.Mock).mockReturnValue({});

      mocks = createMocks({token: 'invalid-token'}, jest.fn());

      await confirmEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "Invalid token" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invalid token',
      });
    });
  });

  describe('when the user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      (magicLogin.decodeToken as jest.Mock).mockReturnValue({
        userId: new mongoose.Types.ObjectId().toHexString(),
        destination: 'new-email@example.com',
      });

      mocks = createMocks({token: 'valid-token'}, jest.fn());

      await confirmEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "User not found" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when user is found and email confirmation succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        email: 'old-email@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
      });

      (magicLogin.decodeToken as jest.Mock).mockReturnValue({
        userId: user._id.toHexString(),
        destination: 'new-email@example.com',
      });

      mocks = createMocks({token: 'valid-token'}, (user, callback) => {
        callback(undefined);
      });

      await confirmEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the user email and marks email as verified', async () => {
      const updatedUser = await User.findOne({
        email: 'new-email@example.com',
      });
      expect(updatedUser).toBeTruthy();
      expect(updatedUser?.isEmailVerified).toBe(true);
      expect(mocks.res.statusCode).toBe(204);
    });
  });

  describe('when logIn fails', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        email: 'old-email@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
      });

      (magicLogin.decodeToken as jest.Mock).mockReturnValue({
        userId: user._id.toHexString(),
        destination: 'new-email@example.com',
      });

      mocks = createMocks({token: 'valid-token'}, (user, callback) => {
        callback(new Error('Login failed'));
      });

      await confirmEmail(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 500 with "Internal server error" error', async () => {
      expect(mocks.res.statusCode).toBe(500);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Internal server error',
      });
    });
  });
});
