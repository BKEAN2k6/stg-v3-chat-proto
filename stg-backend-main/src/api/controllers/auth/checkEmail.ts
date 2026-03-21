import {type Request, type Response} from 'express';
import {User} from '../../../models';
import {
  type CheckEmailExistsRequest,
  type CheckEmailExistsResponse,
} from '../../client/ApiTypes';

export async function checkEmailExists(
  request: Request,
  response: Response,
): Promise<void> {
  const {email} = request.body as CheckEmailExistsRequest;

  const user = await User.exists({email});
  response.json({exists: Boolean(user)} satisfies CheckEmailExistsResponse);
}
