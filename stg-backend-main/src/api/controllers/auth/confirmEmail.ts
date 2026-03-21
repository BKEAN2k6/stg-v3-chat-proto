import {type Request, type Response} from 'express';
import {type ConfirmEmailRequest} from '../../client/ApiTypes';
import magicLogin from '../../../passport/magic-login';
import {User} from '../../../models';

export async function confirmEmail(
  request: Request,
  response: Response,
): Promise<void> {
  const {token} = request.body as ConfirmEmailRequest;
  const {userId, destination} = magicLogin.decodeToken(token) as {
    userId: string;
    destination: string;
  };

  if (!destination || !userId) {
    response.status(400).json({error: 'Invalid token'});
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    response.status(400).json({error: 'User not found'});
    return;
  }

  user.email = destination;
  user.isEmailVerified = true;
  await user.save();

  request.logIn(user, (error) => {
    if (error) {
      response.status(500).json({error: 'Internal server error'});
      return;
    }

    response.sendStatus(204);
  });
}
