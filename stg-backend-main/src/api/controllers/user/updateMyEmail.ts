import {type Request, type Response} from 'express';
import {
  type UpdateMyEmailRequest,
  type UpdateMyEmailResponse,
} from '../../client/ApiTypes';
import {User} from '../../../models';
import magicLogin from '../../../passport/magic-login';

export async function updateMyEmail(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.user) {
    response.status(401).json({error: 'Unauthorized'});
    return;
  }

  const {email, password} = request.body as UpdateMyEmailRequest;

  const {error} = await request.user.authenticate(password);
  if (error) {
    response.status(400).json({error: 'Password is incorrect'});
    return;
  }

  if (await User.exists({email})) {
    response
      .status(400)
      .json({error: 'User with a given email already exists'});
    return;
  }

  const {firstName, id} = request.user;

  const code = await magicLogin.sendConfirmNewEmail(firstName, id, email);

  response.json({code} satisfies UpdateMyEmailResponse);
}
