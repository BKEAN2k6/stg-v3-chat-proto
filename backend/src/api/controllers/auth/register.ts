import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {type RegisterRequest} from '../../client/ApiTypes.js';
import {sendWelcomeToNewUser} from './magic-login/index.js';

export async function register(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    firstName,
    lastName,
    email,
    language,
    country,
    organization,
    organizationType,
    organizationRole,
  } = request.body as RegisterRequest;

  if (await User.exists({email})) {
    response
      .status(400)
      .json({error: 'User with a given email already exists'});
    return;
  }

  await sendWelcomeToNewUser({
    email,
    firstName,
    lastName,
    language,
    country,
    organization,
    organizationType,
    organizationRole,
  });
  response.sendStatus(204);
}
