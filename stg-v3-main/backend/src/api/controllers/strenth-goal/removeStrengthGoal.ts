import {type Request, type Response} from 'express';
import {StrengthGoal} from '../../../models/index.js';
import {type RemoveStrengthGoalParameters} from '../../client/ApiTypes.js';

export async function removeStrengthGoal(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveStrengthGoalParameters;

  const strengthGoal = await StrengthGoal.findById(id);
  if (!strengthGoal) {
    response.status(404).json({error: 'Strength goal not found'});
    return;
  }

  await strengthGoal.deleteOne();

  response.sendStatus(204);
}
