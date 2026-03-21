import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {StrengthGoal} from '../../../models/index.js';
import {
  type UpdateStrengthGoalRequest,
  type UpdateStrengthGoalResponse,
  type UpdateStrengthGoalParameters,
} from '../../client/ApiTypes.js';

export async function updateStrengthGoal(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateStrengthGoalParameters;
  const {strength, description, target, targetDate} =
    request.body as UpdateStrengthGoalRequest;
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

  if (strength) {
    strengthGoal.strength = strength;
  }

  if (description) {
    strengthGoal.description = description;
  }

  if (target) {
    strengthGoal.target = target;
  }

  if (targetDate) {
    strengthGoal.targetDate = new Date(targetDate);
  }

  await strengthGoal.save();

  response.json({
    ...strengthGoal.toJSON(),
    events: strengthGoal.events.map((event) => ({
      createdAt: event.createdAt.toJSON(),
    })),
    targetDate: strengthGoal.targetDate.toJSON(),
    createdAt: strengthGoal.createdAt!.toJSON(),
    updatedAt: strengthGoal.updatedAt!.toJSON(),
    group: strengthGoal.group.toJSON(),
  } satisfies UpdateStrengthGoalResponse);
}
