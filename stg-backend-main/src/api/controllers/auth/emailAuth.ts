import {type Request, type Response} from 'express';
import magicLogin from '../../../passport/magic-login';

export async function emailAuth(
  request: Request,
  response: Response,
): Promise<void> {
  const {destination, invitationCode, firstName, lastName, resetPassword} =
    request.body as {
      destination: string;
      invitationCode: string;
      firstName: string;
      lastName: string;
      resetPassword: boolean;
    };

  request.body = {
    destination,
    invitationCode,
    firstName,
    lastName,
    resetPassword,
  };
  magicLogin.send(request, response);
}
