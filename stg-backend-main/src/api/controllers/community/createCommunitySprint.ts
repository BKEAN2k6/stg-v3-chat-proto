import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint, Community} from '../../../models';
import {type CreateCommunitySprintParameters} from '../../client/ApiTypes';

export async function createCommunitySprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: community} = request.params as CreateCommunitySprintParameters;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);

  if (!(await Community.exists({_id: community}))) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const sprint = await Sprint.create({community, createdBy});
  response.status(201).json(sprint);
}
