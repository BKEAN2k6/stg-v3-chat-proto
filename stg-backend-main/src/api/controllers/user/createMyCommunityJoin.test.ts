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
import {CommunityInvitation, Community, User} from '../../../models';
import routes from '../index';

const createMyCommunityJoin = applySchemas(
  routes['/users/me/community-join'].post,
);

const createMocks = (
  body: Record<string, unknown>,
  userId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    body,
    user: {
      id: userId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createMyCommunityJoin', () => {
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

  describe('when invitation is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        {code: 'invalid-code'},
        new mongoose.Types.ObjectId(),
      );

      await createMyCommunityJoin(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 401 with "Invitation not found" error', async () => {
      expect(mocks.res.statusCode).toBe(401);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invitioan not found',
      });
    });
  });

  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const invitation = await CommunityInvitation.create({
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(
        {code: invitation.code},
        new mongoose.Types.ObjectId(),
      );

      await createMyCommunityJoin(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "User not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        email: 'test1@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      const invitation = await CommunityInvitation.create({
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks({code: invitation.code}, user._id);

      await createMyCommunityJoin(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Community not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when user successfully joins the community', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        email: 'test2@example.com',
        firstName: 'Test',
        lastName: 'User',
      });

      const community = await Community.create({
        name: 'Test Community',
      });

      const invitation = await CommunityInvitation.create({
        community: community._id,
      });

      mocks = createMocks({code: invitation.code}, user._id);

      await createMyCommunityJoin(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 204 and adds the user to the community', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
