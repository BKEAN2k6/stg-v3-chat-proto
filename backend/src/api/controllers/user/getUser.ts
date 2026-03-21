import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {
  type GetUserParameters,
  type GetUserResponse,
} from '../../client/ApiTypes.js';

export async function getUser(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetUserParameters;

  const user = await User.findById(id);

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  response.json(user.toJSON() satisfies GetUserResponse);
}
