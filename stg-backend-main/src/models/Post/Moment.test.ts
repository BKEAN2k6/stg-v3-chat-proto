import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import mongoose from 'mongoose';
import {Moment, AclItem} from '..';

describe('Moment model', () => {
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
    let momentId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      communityId = new mongoose.Types.ObjectId();

      const moment = await Moment.create({
        community: communityId,
        createdBy: new mongoose.Types.ObjectId(),
      });

      momentId = moment._id;
    });

    it('creates an acl item for the moment', async () => {
      const aclItem = await AclItem.findOne({resourceId: momentId});

      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: momentId.toHexString(),
        parent: communityId.toHexString(),
        roles: [
          {
            _id: expect.any(mongoose.Types.ObjectId),
            role: 'post-owner',
            user: expect.any(mongoose.Types.ObjectId),
          },
        ],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const moment = await Moment.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      resourceId = moment._id;
      await Moment.deleteOne({_id: moment._id});
    });

    it('removes the acl item for the moment', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const moment = await Moment.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      resourceId = moment._id;
      await moment.deleteOne();
    });

    it('removes the acl item for the moment', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });
});
