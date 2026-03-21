import {type Request, type Response} from 'express';
import {isDocumentArray} from '@typegoose/typegoose';
import {CoachPost} from '../../../models/index.js';
import {
  type GetCoachPostParameters,
  type GetCoachPostResponse,
} from '../../client/ApiTypes.js';

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

  if (!isDocumentArray(coachPost.images)) {
    response.status(404).json({error: 'Images not found'});
    return;
  }

  response.json({
    ...coachPost.toJSON(),
    images: coachPost.images.map((image) => image.toJSON()),
    createdAt: coachPost.createdAt!.toJSON(),
    updatedAt: coachPost.updatedAt!.toJSON(),
    showDate: coachPost.showDate.toJSON(),
    postType: 'coach-post',
  } satisfies GetCoachPostResponse);
}
