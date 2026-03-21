import {type Request, type Response} from 'express';
import {type ConfirmEmailRequest} from '../../client/ApiTypes.js';
import {User} from '../../../models/index.js';
import {decodeToken} from './magic-login/index.js';
import createOrUpdateContact from './magic-login/emails/createOrUpdateContact.js';

export async function confirmEmail(
  request: Request,
  response: Response,
): Promise<void> {
  const {token} = request.body as ConfirmEmailRequest;
  const {userId, email} = decodeToken(token) as {
    userId: string;
    email: string;
  };

  if (!email || !userId) {
    response.status(400).json({error: 'Invalid token'});
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    response.status(400).json({error: 'User not found'});
    return;
  }

  user.email = email;
  user.isEmailVerified = true;
  await user.save();

  try {
    await createOrUpdateContact({
      ...user.toJSON(),
      id: user.sequenceNumber.toString(),
      createdAt: user.createdAt!,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Could not create or update contact:', error);
  }

  request.logIn(user, (error) => {
    if (error) {
      response.status(500).json({error: 'Internal server error'});
      return;
    }

    response.sendStatus(204);
  });
}
