import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createTestCommunity,
  registerTestUser,
} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  User,
  Community,
  CommunityMemberInvitation,
  CommunityInvitationNotification,
  CommunityMembership,
} from '../../../models/index.js';
import routes from '../index.js';

const createCommunityMemberInvitation = applySchemas(
  routes['/communities/:id/user-invitations'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body: Record<string, unknown>,
  userId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {id: id.toJSON()},
    body,
    user: {id: userId.toJSON()},
  });

describe('createCommunityMemberInvitation', () => {
  describe('when the user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId();
      const commmunity = await createTestCommunity();
      mocks = createMocks(
        commmunity._id,
        {email: 'nonexistent@example.com', message: 'Invitation message'},
        userId,
      );

      await createCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "User not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when the community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      const invitedUser = await registerTestUser({
        email: 'invited@example.com',
      });
      const communityId = new mongoose.Types.ObjectId();
      const user = await registerTestUser({});

      mocks = createMocks(
        communityId,
        {email: invitedUser.email, message: 'Invitation message'},
        user._id,
      );

      await createCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Community not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when the user is already a member of the community', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      await Community.deleteMany({});
      await CommunityMembership.deleteMany({});
      const invitedUser = await registerTestUser({});
      const community = await createTestCommunity();

      await CommunityMembership.create({
        user: invitedUser._id,
        community: community._id,
        role: 'member',
      });

      const userId = new mongoose.Types.ObjectId();
      mocks = createMocks(
        community._id,
        {email: invitedUser.email, message: 'Invitation message'},
        userId,
      );

      await createCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "User is already a member of this community" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User is already a member of this community',
      });
    });
  });

  describe('when the invitation is successfully created', () => {
    let mocks: Mocks<Request, Response>;
    let invitedUserId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      await User.deleteMany({});
      await Community.deleteMany({});
      await CommunityMemberInvitation.deleteMany({});
      await CommunityInvitationNotification.deleteMany({});

      const invitedUser = await registerTestUser({});
      const community = await createTestCommunity();
      communityId = community._id;

      invitedUserId = invitedUser._id;
      mocks = createMocks(
        community._id,
        {email: invitedUser.email, message: 'Invitation message'},
        new mongoose.Types.ObjectId(),
      );

      await createCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('creates a community user invitation and notification', async () => {
      const invitation = await CommunityMemberInvitation.findOne({
        user: invitedUserId,
        community: communityId,
      });

      const notification = await CommunityInvitationNotification.findOne({
        user: invitedUserId,
        community: communityId,
      });

      expect(invitation).not.toBeNull();
      expect(notification).not.toBeNull();
    });

    it('returns 201 with the invitation details', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        email: mocks.req.body.email as string,
        createdAt: expect.any(String),
      });
    });
  });
});
