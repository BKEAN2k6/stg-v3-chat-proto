import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {StrengthGoal, Group, User, Community} from '../../../models/index.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  registerTestUser,
  createTestCommunity,
  createTestGroup,
} from '../../../test-utils/testDocuments.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {type Community as CommunitySchema} from '../../../models/Community.js';
import {type User as UserSchema} from '../../../models/User.js';
import {type Group as GroupSchema} from '../../../models/Group.js';
import {type StrengthSlug} from '../../client/ApiTypes.js';

const createStrengthGoal = applySchemas(
  routes['/groups/:id/strength-goals'].post,
);

const createMocks = (
  groupId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  requestBody: {
    strength: StrengthSlug;
    description: string;
    target: number;
    targetDate: string;
    events?: Array<{createdAt: string}>;
    isSystemCreated?: boolean;
  },
): Mocks<Request, Response> =>
  createMocksAsync({
    body: requestBody,
    params: {id: groupId.toJSON()},
    user: {id: userId.toJSON()},
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
    },
  });

describe('createStrengthGoal', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await Group.deleteMany({});
      await User.deleteMany({});
      const mockUser = await registerTestUser({});
      const randomGroupId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomGroupId, mockUser._id, {
        strength: 'selfRegulation',
        description: 'Improve strength',
        target: 10,
        targetDate: new Date('2025-12-31').toISOString(),
      });
      await createStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group is found and creating a strength goal succeeds', () => {
    let mocks: Mocks<Request, Response>;
    let group: DocumentType<GroupSchema>;
    let community: DocumentType<CommunitySchema>;
    let user: DocumentType<UserSchema>;

    describe('without events and isSystemCreated provided', () => {
      beforeEach(async () => {
        await StrengthGoal.deleteMany({});
        await Group.deleteMany({});
        await Community.deleteMany({});
        await User.deleteMany({});

        community = await createTestCommunity();
        group = await createTestGroup(
          new mongoose.Types.ObjectId(),
          community._id,
        );

        await Group.updateOne(
          {_id: group._id},
          {$set: {community: community.toObject()}},
        );

        user = await registerTestUser({});
        mocks = createMocks(group._id, user._id, {
          strength: 'selfRegulation',
          description: 'Improve strength',
          target: 10,
          targetDate: new Date('2025-12-31').toISOString(),
        });
        await createStrengthGoal(mocks.req, mocks.res);
        await mocks.result;
      });

      it('should respond with the correct data', () => {
        expect(mocks.res._getJSONData()).toMatchObject({
          strength: 'selfRegulation',
          description: 'Improve strength',
          target: 10,
          targetDate: new Date('2025-12-31').toISOString(),
          events: [],
          group: {
            id: group._id.toJSON(),
            name: 'Test Group',
          },
        });
      });

      it('should update the user lastActiveGroups', async () => {
        const databaseUser = await User.findById(user._id);
        const communityKey = community._id.toJSON();
        const groupId = group._id.toJSON();
        expect(databaseUser?.toJSON().lastActiveGroups).toEqual({
          [communityKey]: groupId,
        });
      });
    });

    describe('with events and isSystemCreated provided', () => {
      beforeEach(async () => {
        await StrengthGoal.deleteMany({});
        await Group.deleteMany({});
        await Community.deleteMany({});
        await User.deleteMany({});

        community = await createTestCommunity();
        group = await createTestGroup(
          new mongoose.Types.ObjectId(),
          community._id,
        );

        await Group.updateOne(
          {_id: group._id},
          {$set: {community: community.toObject()}},
        );

        user = await registerTestUser({});
        mocks = createMocks(group._id, user._id, {
          strength: 'selfRegulation',
          description: 'Improve strength with events',
          target: 20,
          targetDate: new Date('2025-11-30').toISOString(),
          events: [
            {createdAt: new Date('2025-01-01').toISOString()},
            {createdAt: new Date('2025-02-01').toISOString()},
          ],
          isSystemCreated: true,
        });

        await createStrengthGoal(mocks.req, mocks.res);
        await mocks.result;
      });

      it('should respond with the correct data including transformed events', () => {
        expect(mocks.res._getJSONData()).toMatchObject({
          strength: 'selfRegulation',
          description: 'Improve strength with events',
          target: 20,
          targetDate: new Date('2025-11-30').toISOString(),
          events: [
            {createdAt: new Date('2025-01-01').toISOString()},
            {createdAt: new Date('2025-02-01').toISOString()},
          ],
          group: {
            id: group._id.toJSON(),
            name: 'Test Group',
          },
        });
      });

      it('should update community strengths and leaderboard using stats', () => {
        expect(mocks.req.stats.updateCommunityStrenghts).toHaveBeenCalledWith(
          group.community._id.toJSON(),
          expect.any(Date),
          ['selfRegulation', 'selfRegulation'],
        );
        expect(mocks.req.stats.updateLeaderboard).toHaveBeenCalledWith(
          user._id.toJSON(),
          group.community._id.toJSON(),
          expect.any(Date),
          2,
        );
      });

      it('should update the user lastActiveGroups', async () => {
        const databaseUser = await User.findById(user._id);
        const communityKey = community._id.toJSON();
        const groupId = group._id.toJSON();
        expect(databaseUser?.toJSON().lastActiveGroups).toEqual({
          [communityKey]: groupId,
        });
      });
    });
  });
});
