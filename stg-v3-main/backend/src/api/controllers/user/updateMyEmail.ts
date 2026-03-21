import {type Request, type Response} from 'express';
import {
  type UpdateMyEmailRequest,
  type UpdateMyEmailResponse,
} from '../../client/ApiTypes.js';
import {User} from '../../../models/index.js';
import {sendConfirmNewEmail} from '../auth/magic-login/index.js';

export async function updateMyEmail(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.user) {
    response.status(401).json({error: 'Unauthorized'});
    return;
  }

  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const {email, password} = request.body as UpdateMyEmailRequest;

  const {error} = await user.authenticate(password);
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

  const code = await sendConfirmNewEmail({
    email,
    firstName: user.firstName,
    userId: user._id.toJSON(),
  });

  response.json({code} satisfies UpdateMyEmailResponse);
}
