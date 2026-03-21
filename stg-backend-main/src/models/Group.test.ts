import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import mongoose from 'mongoose';
import {Group, AclItem} from '.';

describe('Group model', () => {
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
    let groupId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      communityId = new mongoose.Types.ObjectId();
      const group = await Group.create({
        name: 'test group',
        description: 'test description',
        community: communityId,
      });

      groupId = group._id;
    });

    it('creates an acl item for the group', async () => {
      const aclItem = await AclItem.findOne({resourceId: groupId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: groupId.toHexString(),
        parent: communityId.toHexString(),
        roles: [],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const group = await Group.create({
        name: 'test group',
        description: 'test description',
        community: new mongoose.Types.ObjectId(),
      });

      resourceId = group._id;
      await Group.deleteOne({_id: group._id});
    });

    it('removes the acl item for the group', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const group = await Group.create({
        name: 'test group',
        description: 'test description',
        community: new mongoose.Types.ObjectId(),
      });

      resourceId = group._id;
      await group.deleteOne();
    });

    it('removes the acl item for the group', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });
});
