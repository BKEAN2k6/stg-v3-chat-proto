import {type Request, type Response} from 'express';
import magicLogin from '../../../passport/magic-login';
import {User} from '../../../models';
import {type CreateUserRequest} from '../../client/ApiTypes';

export async function createUser(
  request: Request,
  response: Response,
): Promise<void> {
  const {firstName, lastName, email, language} =
    request.body as CreateUserRequest;

  if (await User.exists({email})) {
    response
      .status(400)
      .json({error: 'User with a given email already exists'});
    return;
  }

  request.body = {
    destination: email,
    isRegistration: true,
    firstName,
    lastName,
    language,
    resetPassword: true,
  };

  magicLogin.send(request, response);
}
