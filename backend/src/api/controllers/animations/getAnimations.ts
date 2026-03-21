import {type Request, type Response} from 'express';
import {AnimationProject} from '../../../models/index.js';

export async function getAnimations(
  request: Request,
  response: Response,
): Promise<void> {
  const animations = await AnimationProject.find()
    .populate({
      path: 'updatedBy',
      select: '_id firstName lastName avatar',
    })
    .populate({
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    });

  response.json(animations);
}
