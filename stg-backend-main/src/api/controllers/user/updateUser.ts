import {type Request, type Response} from 'express';
import {User} from '../../../models';
import {
  type UpdateUserRequest,
  type UpdateUserParameters,
  type UpdateUserResponse,
} from '../../client/ApiTypes';

export async function updateUser(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateUserParameters;

  const user = await User.findById(id);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const {
    firstName,
    lastName,
    password,
    email,
    language,
    isEmailVerified,
    roles,
  } = request.body as UpdateUserRequest;

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (email) {
    user.email = email;
  }

  if (language) {
    user.language = language;
  }

  if (isEmailVerified) {
    user.isEmailVerified = isEmailVerified;
  }

  if (password) {
    await user.setPassword(password);
  }

  if (roles) {
    user.roles = roles;
  }

  await user.save();

  response.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    language: user.language,
    isEmailVerified: user.isEmailVerified!,
    roles: user.roles,
  } satisfies UpdateUserResponse);
}
