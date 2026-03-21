import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {type GetMyLastActiveGroupsResponse} from '../../client/ApiTypes.js';

export async function getMyLastActiveGroups(
  request: Request,
  response: Response,
): Promise<void> {
  const user = await User.findById(request.user.id);

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const lastActiveGroups = user.lastActiveGroups ?? {};

  response.json(lastActiveGroups satisfies GetMyLastActiveGroupsResponse);
}
