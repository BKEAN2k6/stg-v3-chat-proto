import {type Request, type Response} from 'express';
import {StrengthGoal} from '../../../models/index.js';
import {
  type GetGroupStrengthCompletedCountParameters,
  type GetGroupStrengthCompletedCountResponse,
} from '../../client/ApiTypes.js';

export async function getGroupStrengthCompletedCount(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, strength} =
    request.params as GetGroupStrengthCompletedCountParameters;
  const completedCount = await StrengthGoal.countDocuments({
    group: id,
    strength,
    $expr: {
      $eq: ['$target', {$size: '$events'}],
    },
  });

  response.json(
    completedCount satisfies GetGroupStrengthCompletedCountResponse,
  );
}
