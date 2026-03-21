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

const removeStrengthGoal = applySchemas(routes['/strength-goals/:id'].delete);

const createMocks = (
  strengthGoalId: mongoose.Types.ObjectId,
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: strengthGoalId.toJSON()},
  });

describe('removeStrengthGoal', () => {
  describe('when strength goal is not found', () => {
    let mocks: Mocks<Request, Response>;
    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      const randomId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomId);

      await removeStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Strength goal not found',
      });
    });
  });

  describe('when strength goal is found', () => {
    let mocks: Mocks<Request, Response>;
    let strengthGoal: DocumentType<StrengthGoalSchema>;

    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      strengthGoal = await StrengthGoal.create({
        strength: 'selfRegulation',
        description: 'Improve self regulation',
        target: 3,
        targetDate: new Date('2025-12-31'),
        events: [],
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(strengthGoal._id);
      await removeStrengthGoal(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send status 204', () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('should delete the strength goal from the database', async () => {
      const found = await StrengthGoal.findById(strengthGoal._id);
      expect(found).toBeNull();
    });
  });
});
