import {type Request, type Response} from 'express';
import {CoachPost} from '../../../models';
import {
  type GetCoachPostParameters,
  type GetCoachPostResponse,
} from '../../client/ApiTypes';

export async function getCoachPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCoachPostParameters;

  const coachPost = await CoachPost.findById(id);
  if (!coachPost) {
    response.status(404).json({error: 'CoachPost not found'});
    return;
  }

  response.json(coachPost.toJSON() satisfies GetCoachPostResponse);
}
