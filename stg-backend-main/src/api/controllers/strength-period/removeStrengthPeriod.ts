import {type Request, type Response} from 'express';
import {StrenghtPeriod} from '../../../models';
import {type RemoveStrengthPeriodParameters} from '../../client/ApiTypes';

export async function removeStrengthPeriod(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveStrengthPeriodParameters;
  const strenghtPeriod = await StrenghtPeriod.findById(id);

  if (!strenghtPeriod) {
    response.status(404).json({error: 'Strength period not found'});
    return;
  }

  await strenghtPeriod.deleteOne();

  response.sendStatus(204);
}
