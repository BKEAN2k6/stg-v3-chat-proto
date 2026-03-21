import mongose from 'mongoose';
import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {
  type GetStrengthGoalsParameters,
  type GetStrengthGoalsResponse,
} from '../../client/ApiTypes.js';
import {StrengthGoal} from '../../../models/index.js';

export async function getStrengthGoals(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetStrengthGoalsParameters;

  const strengthGoals = await StrengthGoal.find({
    group: new mongose.Types.ObjectId(id),
  }).populate({
    path: 'group',
    select: '_id name',
  });

  response.json(
    strengthGoals.map((strengthGoal) => {
      if (!isDocument(strengthGoal.group)) {
        throw new Error('Group is not a document');
      }

      return {
        ...strengthGoal.toJSON(),
        events: strengthGoal.events.map((event) => ({
          createdAt: event.createdAt.toJSON(),
        })),
        targetDate: strengthGoal.targetDate.toJSON(),
        createdAt: strengthGoal.createdAt!.toJSON(),
        updatedAt: strengthGoal.updatedAt!.toJSON(),
        group: strengthGoal.group.toJSON(),
      };
    }) satisfies GetStrengthGoalsResponse,
  );
}
