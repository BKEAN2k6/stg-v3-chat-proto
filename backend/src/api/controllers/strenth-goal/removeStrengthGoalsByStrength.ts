import {type Request, type Response} from 'express';
import {StrengthGoal} from '../../../models/index.js';
import {
  type RemoveStrengthGoalsByStrengthParameters,
  type RemoveStrengthGoalsByStrengthQuery,
} from '../../client/ApiTypes.js';

export async function removeStrengthGoalsByStrength(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveStrengthGoalsByStrengthParameters;
  const {strength} = request.query as RemoveStrengthGoalsByStrengthQuery;

  const strengthGoals = await StrengthGoal.find({
    group: id,
    strength,
  });

  await Promise.all(
    strengthGoals.map((strengthGoal) => strengthGoal.deleteOne()),
  );

  response.sendStatus(204);
}
