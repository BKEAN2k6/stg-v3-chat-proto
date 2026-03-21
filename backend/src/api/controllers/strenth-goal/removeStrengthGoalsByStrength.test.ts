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

const removeStrengthGoalsByStrength = applySchemas(
  routes['/groups/:id/strength-goals'].delete,
);

const createMocks = (
  groupId: mongoose.Types.ObjectId,
  strength: string,
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: groupId.toJSON()},
    query: {strength},
  });

describe('removeStrengthGoalsByStrength', () => {
  describe('when no matching strength goals exist', () => {
    let mocks: Mocks<Request, Response>;
    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      const groupId = new mongoose.Types.ObjectId();
      mocks = createMocks(groupId, 'selfRegulation');

      await removeStrengthGoalsByStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with status 204', () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('should leave the StrengthGoal collection empty', async () => {
      const count = await StrengthGoal.countDocuments({});
      expect(count).toBe(0);
    });
  });

  describe('when matching strength goals exist', () => {
    let mocks: Mocks<Request, Response>;
    let groupId: mongoose.Types.ObjectId;
    const matchingStrength = 'selfRegulation';
    let matchingGoals: Array<DocumentType<StrengthGoalSchema>>;
    let nonMatchingGoal: DocumentType<StrengthGoalSchema>;

    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      groupId = new mongoose.Types.ObjectId();

      matchingGoals = await Promise.all([
        StrengthGoal.create({
          strength: matchingStrength,
          description: 'Goal 1',
          target: 3,
          targetDate: new Date('2025-12-31'),
          events: [],
          group: groupId,
          createdBy: new mongoose.Types.ObjectId(),
        }),
        StrengthGoal.create({
          strength: matchingStrength,
          description: 'Goal 2',
          target: 5,
          targetDate: new Date('2025-11-30'),
          events: [],
          group: groupId,
          createdBy: new mongoose.Types.ObjectId(),
        }),
      ]);

      nonMatchingGoal = await StrengthGoal.create({
        strength: 'otherStrength',
        description: 'Non matching goal',
        target: 4,
        targetDate: new Date('2025-10-31'),
        events: [],
        group: groupId,
        createdBy: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(groupId, matchingStrength);
      await removeStrengthGoalsByStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with status 204', () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('should delete only the matching strength goals', async () => {
      for (const goal of matchingGoals) {
        const found = await StrengthGoal.findById(goal._id); // eslint-disable-line no-await-in-loop
        expect(found).toBeNull();
      }

      const foundNonMatching = await StrengthGoal.findById(nonMatchingGoal._id);
      expect(foundNonMatching).not.toBeNull();
    });
  });
});
