import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  CommunityMemberInvitation,
  Community,
  User,
} from '../../../models/index.js';
import routes from '../index.js';

const updateMyCommunityInvitation = applySchemas(
  routes['/users/me/community-invitations/:id'].patch,
);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {id: id.toJSON()},
  });

describe('updateMyCommunityInvitation', () => {
  describe('when the invitation is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateMyCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Invitation not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invitation not found',
      });
    });
  });

  describe('when the community is not populated', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const invitation = await CommunityMemberInvitation.create({
        user: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(invitation._id);

      await updateMyCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Community not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when the user is not populated', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
      });

      const invitation = await CommunityMemberInvitation.create({
        user: new mongoose.Types.ObjectId(),
        community: community._id,
      });

      mocks = createMocks(invitation._id);

      await updateMyCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "User not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when the invitation is processed successfully', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      await CommunityMemberInvitation.deleteMany({});
      const user = await registerTestUser({});

      const community = await Community.create({
        name: 'Test Community',
      });

      const invitation = await CommunityMemberInvitation.create({
        user: user._id,
        community: community._id,
      });

      vi.spyOn(Community.prototype, 'upsertMemberAndSave');

      mocks = createMocks(invitation._id);

      await updateMyCommunityInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('adds the user to the community and deletes the invitation', async () => {
      expect(Community.prototype.upsertMemberAndSave).toHaveBeenCalledWith(
        expect.any(mongoose.Types.ObjectId),
        'member',
      );

      const invitation = await CommunityMemberInvitation.findOne();
      expect(invitation).toBeNull();
    });

    it('returns 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
