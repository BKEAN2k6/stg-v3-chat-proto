import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongose from 'mongoose';
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

const getStrengthGoals = applySchemas(routes['/groups/:id/strength-goals'].get);

const createMocks = (
  groupId: mongose.Types.ObjectId,
): Mocks<Request, Response> =>
  createMocksAsync({
    params: {id: groupId.toJSON()},
  });

describe('getStrengthGoals', () => {
  describe('when strength goals exist for the group', () => {
    let mocks: Mocks<Request, Response>;
    let group: DocumentType<GroupSchema>;
    let strengthGoal: DocumentType<StrengthGoalSchema>;

    beforeEach(async () => {
      await StrengthGoal.deleteMany({});
      await Group.deleteMany({});
      await Community.deleteMany({});
      await User.deleteMany({});

      group = await createTestGroup(
        new mongose.Types.ObjectId(),
        new mongose.Types.ObjectId(),
      );

      const targetDate = new Date('2025-12-31');
      strengthGoal = await StrengthGoal.create({
        strength: 'selfRegulation',
        description: 'Improve self regulation',
        target: 3,
        targetDate,
        events: [],
        group: group._id,
        createdBy: new mongose.Types.ObjectId(),
      });

      mocks = createMocks(group._id);
      await getStrengthGoals(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should return an array with the strength goal(s) mapped properly', () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: strengthGoal._id.toJSON(),
          strength: strengthGoal.strength,
          description: strengthGoal.description,
          target: strengthGoal.target,
          targetDate: strengthGoal.targetDate.toISOString(),
          events: [],
          group: {
            id: group._id.toJSON(),
            name: group.name,
          },
          isSystemCreated: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
});
