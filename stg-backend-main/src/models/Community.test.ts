import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {type Community as CommunityDocument} from './Community';
import {Community, AclItem, CommunityMembership} from '.';

describe('Community model', () => {
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

  describe('when a new document is created', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      resourceId = community._id;
    });

    it('creates an acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: resourceId.toHexString(),
        roles: [],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      resourceId = community._id;
      await Community.deleteOne({_id: community._id});
    });

    it('removes the acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      resourceId = community._id;
      await community.deleteOne();
    });

    it('removes the acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('upsertMemberAndSave', () => {
    describe('when the user is not a member yet', () => {
      let community: DocumentType<CommunityDocument>;
      let user: mongoose.Types.ObjectId;

      beforeEach(async () => {
        community = await Community.create({
          name: 'test community',
          description: 'test description',
        });

        user = new mongoose.Types.ObjectId();
        await community.upsertMemberAndSave(user, 'member');
      });

      it('creates a community membership', async () => {
        const membership = await CommunityMembership.findOne({
          community: community._id,
          user,
        });
        expect(membership?.role).toBe('member');
      });

      it('adds the user to the acl item', async () => {
        const aclItem = await AclItem.findOne({resourceId: community._id});
        expect(aclItem?.toJSON()).toEqual({
          _id: expect.any(mongoose.Types.ObjectId),
          resourceId: community._id.toHexString(),
          roles: [
            {
              _id: expect.any(mongoose.Types.ObjectId),
              user,
              role: 'community-member',
            },
          ],
          __v: 0,
        });
      });
    });

    describe('when the user is a member already', () => {
      let community: DocumentType<CommunityDocument>;
      let user: mongoose.Types.ObjectId;

      beforeEach(async () => {
        community = await Community.create({
          name: 'test community',
          description: 'test description',
        });

        user = new mongoose.Types.ObjectId();
        await CommunityMembership.create({
          community: community._id,
          user,
          role: 'member',
        });
        await community.upsertMemberAndSave(user, 'admin');
      });

      it('updates the community membership', async () => {
        const membership = await CommunityMembership.findOne({
          community: community._id,
          user,
        });
        expect(membership?.role).toBe('admin');
      });

      it('updates the acl item', async () => {
        const aclItem = await AclItem.findOne({resourceId: community._id});
        expect(aclItem?.toJSON()).toEqual({
          _id: expect.any(mongoose.Types.ObjectId),
          resourceId: community._id.toHexString(),
          roles: [
            {
              _id: expect.any(mongoose.Types.ObjectId),
              user,
              role: 'community-admin',
            },
          ],
          __v: 0,
        });
      });
    });
  });

  describe('removeMemberAndSave', () => {
    let community: DocumentType<CommunityDocument>;
    let user: mongoose.Types.ObjectId;

    beforeEach(async () => {
      community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      user = new mongoose.Types.ObjectId();
      await community.upsertMemberAndSave(user, 'member');
      await community.removeMemberAndSave(user);
    });

    it('removes the community membership', async () => {
      const membership = await CommunityMembership.findOne({
        community: community._id,
        user,
      });
      expect(membership).toBeNull();
    });

    it('removes the user from the acl item', async () => {
      const aclItem = await AclItem.findOne({resourceId: community._id});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: community._id.toHexString(),
        roles: [],
        __v: 0,
      });
    });
  });
});
