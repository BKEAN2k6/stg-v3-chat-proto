import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {type EmailAuthRequest} from '../../client/ApiTypes.js';
import {sendResetPassword, sendSingleSignOn} from './magic-login/index.js';

export async function emailAuth(
  request: Request,
  response: Response,
): Promise<void> {
  const {email, resetPassword} = request.body as EmailAuthRequest;

  const user = await User.findOne({email});
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  if (resetPassword) {
    await sendResetPassword({
      email: user.email,
      firstName: user.firstName,
    });
    response.sendStatus(204);
  } else {
    await sendSingleSignOn({
      email: user.email,
      firstName: user.firstName,
    });
    response.sendStatus(204);
  }
}
