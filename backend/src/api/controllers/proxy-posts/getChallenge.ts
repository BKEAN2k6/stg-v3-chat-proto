import {type Request, type Response} from 'express';
import {Challenge} from '../../../models/index.js';
import {
  type GetChallengeResponse,
  type GetChallengeParameters,
} from '../../client/ApiTypes.js';

export async function getChallenge(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetChallengeParameters;

  const challenge = await Challenge.findById(id);
  if (!challenge) {
    response.status(404).json({error: 'Challenge not found'});
    return;
  }

  response.json({
    ...challenge.toJSON(),
    createdAt: challenge.createdAt!.toJSON(),
    updatedAt: challenge.updatedAt!.toJSON(),
    showDate: challenge.showDate.toJSON(),
    postType: 'challenge',
  } satisfies GetChallengeResponse);
}
