import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import mongoose from 'mongoose';
import {Sprint, AclItem} from '.';

describe('Sprint model', () => {
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
    let sprintId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      communityId = new mongoose.Types.ObjectId();

      const sprint = await Sprint.create({
        community: communityId,
        createdBy: new mongoose.Types.ObjectId(),
      });

      sprintId = sprint._id;
    });

    it('creates an acl item for the sprint', async () => {
      const aclItem = await AclItem.findOne({resourceId: sprintId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: sprintId.toHexString(),
        parent: communityId.toHexString(),
        roles: [],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      resourceId = sprint._id;
      await Sprint.deleteOne({_id: sprint._id});
    });

    it('removes the acl item for the sprint', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      resourceId = sprint._id;
      await sprint.deleteOne();
    });

    it('removes the acl item for the sprint', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });
});
