import {type Request, type Response} from 'express';
import {AnimationProject} from '../../../models/index.js';

export async function getAnimation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as {id: string};

  // Find the animation project by ID
  const animationProject = await AnimationProject.findById(id);
  if (!animationProject) {
    response.status(404).json({error: 'Animation project not found'});
    return;
  }

  response.json(animationProject);
}
