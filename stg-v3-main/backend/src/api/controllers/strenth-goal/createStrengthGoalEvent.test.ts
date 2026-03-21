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
import {type StrengthGoal as StrengthGoalSchema} from '../../../models/StrengthGoal.js';
import {type Group as GroupSchema} from '../../../models/Group.js';
import {type Community as CommunitySchema} from '../../../models/Community.js';
import {type User as UserSchema} from '../../../models/User.js';

const createStrengthGoalEvent = applySchemas(
  routes['/strength-goals/:id/events'].post,
);

const createMocks = (
  strengthGoalId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: strengthGoalId.toJSON()},
    user: {id: userId.toJSON()},
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
    },
    events: {},
  });

describe('createStrengthGoalEvent', () => {
  describe('when strength goal is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await User.deleteMany({});
      await Community.deleteMany({});

      const testUser = await registerTestUser({});
      const randomId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomId, testUser._id);

      await createStrengthGoalEvent(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Strength goal not found',
      });
    });
  });

  describe('when strength goal is found and event is added successfully', () => {
    let mocks: Mocks<Request, Response>;
    let strengthGoal: DocumentType<StrengthGoalSchema>;
    let group: DocumentType<GroupSchema>;
    let community: DocumentType<CommunitySchema>;
    let user: DocumentType<UserSchema>;

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

      strengthGoal = await StrengthGoal.create({
        strength: 'selfRegulation',
        description: 'Improve self regulation',
        target: 3,
        targetDate: new Date('2025-12-31'),
        events: [],
        group: group._id,
        createdBy: new mongoose.Types.ObjectId(),
      });

      await StrengthGoal.updateOne(
        {_id: strengthGoal._id},
        {$set: {group: group.toObject()}},
      );

      user = await registerTestUser({});
      mocks = createMocks(strengthGoal._id, user._id);

      await createStrengthGoalEvent(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the created event timestamp', () => {
      expect(mocks.res._getJSONData()).toEqual({
        createdAt: expect.stringMatching(/.+/) as unknown as string,
      });
    });

    it('should call stats update functions', () => {
      expect(mocks.req.stats.updateCommunityStrenghts).toHaveBeenCalledWith(
        community._id.toJSON(),
        expect.any(Date),
        ['selfRegulation'],
      );
      expect(mocks.req.stats.updateLeaderboard).toHaveBeenCalledWith(
        user._id.toJSON(),
        community._id.toJSON(),
        expect.any(Date),
        1,
      );
    });
  });
});
