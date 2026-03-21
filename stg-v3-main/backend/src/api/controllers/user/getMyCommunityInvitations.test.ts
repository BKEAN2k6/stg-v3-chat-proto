import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import type mongoose from 'mongoose';
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

const getMyCommunityInvitations = applySchemas(
  routes['/users/me/community-invitations'].get,
);

const createMocks = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: userId.toJSON(),
    },
  });

describe('getMyCommunityInvitations', () => {
  describe('when the user has no invitations', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await CommunityMemberInvitation.deleteMany({});
      const user = await registerTestUser({});
      mocks = createMocks(user._id);

      await getMyCommunityInvitations(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns an empty array', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([]);
    });
  });

  describe('when the user has invitations', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      await Community.deleteMany({});
      await CommunityMemberInvitation.deleteMany({});
      const user = await registerTestUser({});
      const community = await Community.create({
        name: 'Test Community',
      });
      await CommunityMemberInvitation.create({
        user: user._id,
        community: community._id,
        createdBy: user._id,
        message: 'Join us!',
      });

      mocks = createMocks(user._id);

      await getMyCommunityInvitations(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns the list of invitations', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          community: {
            id: expect.any(String),
            name: 'Test Community',
          },
          createdBy: {
            id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            avatar: expect.any(String),
          },
          message: 'Join us!',
        },
      ]);
    });
  });
});
