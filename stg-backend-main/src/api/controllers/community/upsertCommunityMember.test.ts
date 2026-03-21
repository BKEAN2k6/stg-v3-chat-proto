import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type DocumentType} from '@typegoose/typegoose';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {Community, User, CommunityMembership} from '../../../models';
import {type Community as CommunityDocument} from '../../../models/Community';
import {type User as UserDocument} from '../../../models/User';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const upsertCommunityMember = applySchemas(
  routes['/communities/:id/members/:userId'].put,
);

const createRequest = (communityId: string, userId: string) =>
  createMocksAsync({
    body: {
      role: 'member',
    },
    params: {
      id: communityId,
      userId,
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('upsertCommunityMember', () => {
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

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createRequest(
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId().toHexString(),
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test group',
        description: 'This is a test group',
      });

      mocks = createRequest(
        community._id.toHexString(),
        new mongoose.Types.ObjectId().toHexString(),
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when community and user are found', () => {
    let mocks: Mocks<Request, Response>;
    let community: DocumentType<CommunityDocument>;
    let user: DocumentType<UserDocument>;

    beforeEach(async () => {
      await Community.deleteMany({});
      await User.deleteMany({});

      community = await Community.create({
        name: 'Test group',
        description: 'This is a test group',
      });

      user = await User.create({
        name: 'Test user',
        email: 'tesr@test.com',
      });

      mocks = createRequest(
        community._id.toHexString(),
        user._id.toHexString(),
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends no content reponse', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('creates a community member membership', async () => {
      const membership = await CommunityMembership.findOne({
        community: community._id,
        user: user._id,
      });

      expect(membership?.role).toBe('member');
    });
  });
});
