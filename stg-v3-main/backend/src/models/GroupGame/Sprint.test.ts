import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {Sprint, AclItem} from '../index.js';

describe('Sprint model', () => {
  describe('when a new document is created', () => {
    let sprintId: mongoose.Types.ObjectId;
    let groupId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      groupId = new mongoose.Types.ObjectId();

      const sprint = await Sprint.create({
        group: groupId,
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
      });

      sprintId = sprint._id;
    });

    it('creates an acl item for the sprint', async () => {
      const aclItem = await AclItem.findOne({resourceId: sprintId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: sprintId.toJSON(),
        parent: groupId.toJSON(),
        roles: [],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
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
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
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
