import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {Moment, AclItem} from '../index.js';

describe('Moment model', () => {
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
        resourceId: momentId.toJSON(),
        parent: communityId.toJSON(),
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
