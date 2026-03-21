import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {StrengthGoal, Group, Community, User} from '../../../models/index.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {createTestGroup} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';
import {type StrengthGoal as StrengthGoalSchema} from '../../../models/StrengthGoal.js';
import {type Group as GroupSchema} from '../../../models/Group.js';

const updateStrengthGoal = applySchemas(routes['/strength-goals/:id'].patch);

const createMocks = (
  strengthGoalId: mongoose.Types.ObjectId,
  requestBody: {
    strength?: string;
    description?: string;
    target?: number;
    targetDate?: string;
  },
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: strengthGoalId.toJSON()},
    body: requestBody,
  });

describe('updateStrengthGoal', () => {
  describe('when strength goal is not found', () => {
    let mocks: Mocks<Request, Response>;
    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      const randomId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomId, {
        strength: 'emotionalResilience',
        description: 'Updated description',
        target: 10,
        targetDate: new Date('2026-01-01').toISOString(),
      });

      await updateStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Strength goal not found',
      });
    });
  });

  describe('when strength goal is found and updated successfully', () => {
    let mocks: Mocks<Request, Response>;
    let strengthGoal: DocumentType<StrengthGoalSchema>;
    let group: DocumentType<GroupSchema>;

    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      group = await createTestGroup(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      const initialTargetDate = new Date('2025-12-31');
      strengthGoal = await StrengthGoal.create({
        strength: 'selfRegulation',
        description: 'Initial description',
        target: 3,
        targetDate: initialTargetDate,
        events: [],
        group: group._id,
        createdBy: new mongoose.Types.ObjectId(),
      });

      await StrengthGoal.updateOne(
        {_id: strengthGoal._id},
        {$set: {group: group.toObject()}},
      );

      const newTargetDateString = new Date('2026-01-01').toISOString();
      mocks = createMocks(strengthGoal._id, {
        strength: 'love',
        description: 'Updated description',
        target: 10,
        targetDate: newTargetDateString,
      });

      await updateStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with updated strength goal data', () => {
      expect(mocks.res._getJSONData()).toEqual({
        id: strengthGoal._id.toJSON(),
        strength: 'love',
        description: 'Updated description',
        target: 10,
        targetDate: new Date('2026-01-01').toISOString(),
        events: [],
        isSystemCreated: false,
        group: {
          id: group._id.toJSON(),
          name: group.name,
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should update the strength goal in the database', async () => {
      const updated = await StrengthGoal.findById(strengthGoal._id);
      expect(updated?.strength).toEqual('love');
      expect(updated?.description).toEqual('Updated description');
      expect(updated?.target).toEqual(10);
      expect(updated?.targetDate.toISOString()).toEqual(
        new Date('2026-01-01').toISOString(),
      );
    });
  });
});
