import {beforeEach, describe, expect, it} from 'vitest';
import type mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {type Request, type Response} from 'express';
import {type User as UserDocument} from '../../models/User.js';
import {Community, User, Moment} from '../../models/index.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../test-utils/nodeMockHttpAsync.js';
import {registerTestUser} from '../../test-utils/testDocuments.js';
import RolesResolver from './index.js';

const createMocks = (
  user: DocumentType<UserDocument>,
  momentId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {
      id: momentId.toJSON(),
    },
    user,
  });

describe('Roles resolver', () => {
  describe('when roles are based on acl item', () => {
    let superAdminMocks: Mocks<Request, Response>;
    let communityMemberMcoks: Mocks<Request, Response>;
    let communityAdminMocks: Mocks<Request, Response>;

    let rolesResolver: RolesResolver;
    let momentId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      await Community.deleteMany();
      await User.deleteMany();
      await Moment.deleteMany();

      rolesResolver = new RolesResolver();
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      const superAdminUser = await registerTestUser({
        firstName: 'SuperAdmin',
        lastName: 'TestLastName',
        email: 'super-admin@test.com',
        roles: ['super-admin'],
      });

      const communityAdminUser = await registerTestUser({
        firstName: 'CommunityAdmin',
        lastName: 'TestLastName',
        email: 'comnnunity-admin@test.com',
      });

      const communityMemberUser = await registerTestUser({
        firstName: 'CommunityMember',
        lastName: 'TestLastName',
        email: 'comnnunity-member@test.com',
      });

      await community.upsertMemberAndSave(communityAdminUser._id, 'admin');
      await community.upsertMemberAndSave(communityMemberUser._id, 'member');

      const moment = await Moment.create({
        community: community._id,
        createdBy: communityMemberUser._id,
      });

      momentId = moment._id;
      superAdminMocks = createMocks(superAdminUser, momentId);
      communityMemberMcoks = createMocks(communityMemberUser, momentId);
      communityAdminMocks = createMocks(communityAdminUser, momentId);
    });

    it('returns the expexted roles for the super admin', async () => {
      await rolesResolver.getRolesMiddleware(
        superAdminMocks.req,
        superAdminMocks.res,
        () => {
          expect(superAdminMocks.req.roles).toEqual([
            'public',
            'authenticated',
            'super-admin',
          ]);
        },
      );
    });

    it('returns the expexted roles for the community admin', async () => {
      await rolesResolver.getRolesMiddleware(
        communityAdminMocks.req,
        communityAdminMocks.res,
        () => {
          expect(communityAdminMocks.req.roles).toEqual([
            'public',
            'authenticated',
            'community-admin',
          ]);
        },
      );
    });

    it('returns the expexted roles for the community member', async () => {
      await rolesResolver.getRolesMiddleware(
        communityMemberMcoks.req,
        communityMemberMcoks.res,
        () => {
          expect(communityMemberMcoks.req.roles).toEqual([
            'public',
            'authenticated',
            'post-owner',
            'community-member',
          ]);
        },
      );
    });
  });
});
