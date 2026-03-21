import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {
  type GetMyLastActiveGroupsResponse,
  type UpdateMyLastActiveGroupsParameters,
} from '../../client/ApiTypes.js';

export async function updateMyLastActiveGroups(
  request: Request,
  response: Response,
): Promise<void> {
  const user = await User.findById(request.user.id);
  const {id} = request.params as UpdateMyLastActiveGroupsParameters;

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  user.lastActiveGroups ??= new Map<string, string>();

  if (typeof request.body === 'string') {
    user.lastActiveGroups.set(id, request.body);
  } else {
    response.status(400).json({error: 'Invalid request body'});
    return;
  }

  await user.save();

  response.json(
    user.lastActiveGroups ?? ({} satisfies GetMyLastActiveGroupsResponse),
  );
}
