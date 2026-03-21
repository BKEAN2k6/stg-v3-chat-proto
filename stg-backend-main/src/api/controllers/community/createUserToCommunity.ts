import {type Request, type Response} from 'express';
import magicLogin from '../../../passport/magic-login';
import {User} from '../../../models';
import {
  type CreateUserToCommunityRequest,
  type CreateUserToCommunityParameters,
} from '../../client/ApiTypes';

export async function createUserToCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: communityId} = request.params as CreateUserToCommunityParameters;
  const {destination, firstName, lastName, role, language} =
    request.body as CreateUserToCommunityRequest;

  if (await User.exists({email: destination})) {
    response
      .status(400)
      .json({error: 'User with a given email already exists'});
    return;
  }

  request.body = {
    destination,
    firstName,
    lastName,
    role,
    language,
    communityId,
    resetPassword: true,
  };

  magicLogin.send(request, response);
}
