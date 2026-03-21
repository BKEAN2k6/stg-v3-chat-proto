import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  CommunityMemberInvitation,
  CommunityInvitationNotification,
} from '../../../models/index.js';
import routes from '../index.js';

const removeCommunityMemberInvitation = applySchemas(
  routes['/member-invitations/:id'].delete,
);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {id: id.toJSON()},
  });

describe('removeCommunityMemberInvitation', () => {
  describe('when the invitation is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await removeCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Invitation not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invitation not found',
      });
    });
  });

  describe('when the invitation is successfully removed', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await CommunityMemberInvitation.deleteMany({});
      await CommunityInvitationNotification.deleteMany({});

      const invitation = await CommunityMemberInvitation.create({
        community: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      await CommunityInvitationNotification.create({
        actor: invitation.createdBy,
        community: invitation.community,
        message: 'Test notification',
        user: invitation.user,
      });

      mocks = createMocks(invitation._id);

      await removeCommunityMemberInvitation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('deletes the invitation and its notification', async () => {
      const foundInvitation = await CommunityMemberInvitation.findById(
        mocks.req.params.id,
      );
      const foundNotification = await CommunityInvitationNotification.findOne({
        invitation: mocks.req.params.id,
      });

      expect(foundInvitation).toBeNull();
      expect(foundNotification).toBeNull();
    });

    it('returns 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
