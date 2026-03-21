import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {StrengthGoal} from '../../../models/index.js';
import {
  type GetStrengthGoalParameters,
  type GetStrengthGoalResponse,
} from '../../client/ApiTypes.js';

export async function getStrengthGoal(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetStrengthGoalParameters;
  const strengthGoal = await StrengthGoal.findById(id).populate({
    path: 'group',
    select: '_id name',
  });
  if (!strengthGoal) {
    response.status(404).json({error: 'Strength goal not found'});
    return;
  }

  if (!isDocument(strengthGoal.group)) {
    throw new Error('Group is not a document');
  }

  response.json({
    ...strengthGoal.toJSON(),
    targetDate: strengthGoal.targetDate.toISOString(),
    events: strengthGoal.events.map((event) => ({
      createdAt: event.createdAt.toJSON(),
    })),
    createdAt: strengthGoal.createdAt!.toJSON(),
    updatedAt: strengthGoal.updatedAt!.toJSON(),
    group: strengthGoal.group.toJSON(),
  } satisfies GetStrengthGoalResponse);
}
