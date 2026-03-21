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
import routes from '../index.js';
import {type StrengthGoal as StrengthGoalSchema} from '../../../models/StrengthGoal.js';
import {type Group as GroupSchema} from '../../../models/Group.js';
import {createTestGroup} from '../../../test-utils/testDocuments.js';

const getStrengthGoal = applySchemas(routes['/strength-goals/:id'].get);

const createMocks = (
  strengthGoalId: mongoose.Types.ObjectId,
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: strengthGoalId.toJSON()},
  });

describe('getStrengthGoal', () => {
  describe('when strength goal is not found', () => {
    let mocks: Mocks<Request, Response>;
    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      const randomId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomId);

      await getStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Strength goal not found',
      });
    });
  });

  describe('when strength goal is found and group is populated', () => {
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

      const targetDate = new Date('2025-12-31');
      strengthGoal = await StrengthGoal.create({
        strength: 'selfRegulation',
        description: 'Improve self regulation',
        target: 3,
        targetDate,
        events: [],
        group: group._id,
        createdBy: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(strengthGoal._id);
      await getStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should return the strength goal with proper fields', () => {
      expect(mocks.res._getJSONData()).toEqual({
        id: strengthGoal._id.toJSON(),
        strength: strengthGoal.strength,
        description: strengthGoal.description,
        target: strengthGoal.target,
        targetDate: strengthGoal.targetDate.toISOString(),
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
  });
});
