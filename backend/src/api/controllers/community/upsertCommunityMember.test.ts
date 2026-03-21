import {beforeEach, describe, expect, it} from 'vitest';
import {type DocumentType} from '@typegoose/typegoose';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {Community, User, CommunityMembership} from '../../../models/index.js';
import {type Community as CommunityDocument} from '../../../models/Community.js';
import {type User as UserDocument} from '../../../models/User.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const upsertCommunityMember = applySchemas(
  routes['/communities/:id/members/:userId'].put,
);

const createRequest = (
  communityId: string,
  userId: string,
  role: string,
  roles: string[],
) =>
  createMocksAsync({
    body: {
      role,
    },
    user: {
      roles,
    },
    params: {
      id: communityId,
      userId,
    },
  });

describe('upsertCommunityMember', () => {
  describe('when community membership is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test group',
        description: 'This is a test group',
      });

      mocks = createRequest(
        community._id.toJSON(),
        new mongoose.Types.ObjectId().toJSON(),
        'member',
        [],
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User is not a member of the community',
      });
    });
  });

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = new mongoose.Types.ObjectId();
      const community = new mongoose.Types.ObjectId();

      await CommunityMembership.create({
        community,
        user,
        role: 'admin',
      });

      mocks = createRequest(community.toJSON(), user.toJSON(), 'member', []);

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
      const userId = new mongoose.Types.ObjectId().toJSON();
      const community = await Community.create({
        name: 'Test group',
        description: 'This is a test group',
      });

      await CommunityMembership.create({
        community: community._id,
        user: userId,
        role: 'admin',
      });

      mocks = createRequest(community._id.toJSON(), userId, 'member', []);

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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'admin',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'member',
        [],
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

  describe('when existing role is owner', () => {
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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'owner',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'member',
        [],
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Cannot change owner role',
      });
    });
  });

  describe('when new role is owner', () => {
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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'member',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'owner',
        [],
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Cannot change owner role',
      });
    });
  });

  describe('when existing role is owner and the request user is super admin', () => {
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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'owner',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'member',
        ['super-admin'],
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

  describe('when new role is owner and the request user is super admin', () => {
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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'member',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'owner',
        ['super-admin'],
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

      expect(membership?.role).toBe('owner');
    });
  });

  describe('when new and old role are the same', () => {
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

      user = await registerTestUser({});

      await CommunityMembership.create({
        community: community._id,
        user: user._id,
        role: 'admin',
      });

      mocks = createRequest(
        community._id.toJSON(),
        user._id.toJSON(),
        'admin',
        [],
      );

      await upsertCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends no content reponse', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
