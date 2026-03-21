import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {Community, User, CommunityMembership} from '../../../models/index.js';
import {type Community as CommunityDocument} from '../../../models/Community.js';
import {type User as UserDocument} from '../../../models/User.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';

const removeCommunityMember = applySchemas(
  routes['/communities/:id/members/:userId'].delete,
);

const createRequest = (communityId: string, userId: string) => {
  return createMocksAsync({
    params: {
      id: communityId,
      userId,
    },
  });
};

describe('removeCoummunityMember', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createRequest(
        new mongoose.Types.ObjectId().toJSON(),
        new mongoose.Types.ObjectId().toJSON(),
      );

      await removeCommunityMember(mocks.req, mocks.res);
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
        name: 'Test community',
        description: 'This is a test community',
      });

      mocks = createRequest(
        community._id.toJSON(),
        new mongoose.Types.ObjectId().toJSON(),
      );

      await removeCommunityMember(mocks.req, mocks.res);
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

      await community.upsertMemberAndSave(user._id, 'member');

      mocks = createRequest(community._id.toJSON(), user._id.toJSON());

      await removeCommunityMember(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends no content reponse', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('removes the member membership', async () => {
      const membership = await CommunityMembership.findOne({
        community: community._id,
        user: user._id,
      });

      expect(membership).toBeNull();
    });
  });
});
