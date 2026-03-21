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
import {User, Community} from '../../../models';
import routes from '../index';

const updateMe = applySchemas(routes['/users/me'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  selectedCommunity: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    user: {
      id: id.toHexString(),
    },
    body: {
      selectedCommunity,
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      language: 'fi',
      password: 'oldPassword',
      newPassword: 'newPassword',
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('updateMe', () => {
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
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await updateMe(mocks.req, mocks.res);
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
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        groups: [],
      });

      communityId = community._id;

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

      mocks = createMocks(user._id, community._id);

      await updateMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the updated user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        avatar: '',
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        language: 'fi',
        selectedCommunity: communityId.toHexString(),
      });
    });
  });

  describe('when old password does not match', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        language: 'en',
        groups: [],
      });

      const user = await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test2@test.com',
          language: 'en',
          roles: ['test-role'],
        },
        'wrongPassword',
      );

      mocks = createMocks(user._id, community._id);

      await updateMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with an error message', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Existing password did not match',
      });
    });
  });
});
