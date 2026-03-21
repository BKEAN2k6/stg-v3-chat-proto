import {type Request, type Response, type RequestHandler} from 'express';
import passport from 'passport';
import {type MagicLoginResponse} from '../../client/ApiTypes';

const magicAuthetication: RequestHandler = passport.authenticate(
  'magiclogin',
) as RequestHandler;

export async function magicLogin(
  request: Request,
  response: Response,
): Promise<void> {
  magicAuthetication(request, response, () => {
    request.session.allowPasswordChangeUntil = Date.now() + 1000 * 60 * 15;

    response.status(201).json({
      allowPasswordChange: request.user.allowPasswordChange,
    } satisfies MagicLoginResponse);
  });
}
