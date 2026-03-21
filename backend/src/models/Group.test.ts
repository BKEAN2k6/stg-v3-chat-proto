import {expect, it, describe, beforeEach} from 'vitest';
import mongoose from 'mongoose';
import {createTestGroup} from '../test-utils/testDocuments.js';
import {Group, AclItem} from './index.js';

describe('Group model', () => {
  describe('when a new document is created', () => {
    let groupId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      communityId = new mongoose.Types.ObjectId();
      const group = await createTestGroup(
        new mongoose.Types.ObjectId(),
        communityId,
      );

      groupId = group._id;
    });

    it('creates an acl item for the group', async () => {
      const aclItem = await AclItem.findOne({resourceId: groupId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: groupId.toJSON(),
        parent: communityId.toJSON(),
        roles: [
          {
            _id: expect.any(mongoose.Types.ObjectId),
            user: expect.any(mongoose.Types.ObjectId),
            role: 'group-owner',
          },
        ],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const group = await createTestGroup(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

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
      const group = await createTestGroup(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      resourceId = group._id;
      await group.deleteOne();
    });

    it('removes the acl item for the group', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });
});
