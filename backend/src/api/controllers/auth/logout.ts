import {type Request, type Response} from 'express';

export async function logout(
  request: Request,
  response: Response,
): Promise<void> {
  response.clearCookie('connect.sid');
  request.logout(() => {
    request.session.destroy(() => {
      response.sendStatus(204);
    });
  });
}
