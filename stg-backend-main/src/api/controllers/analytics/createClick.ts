import {type Request, type Response} from 'express';
import {Click} from '../../../models';
import {type CreateClickRequest} from '../../client/ApiTypes';

export async function createClick(
  request: Request,
  response: Response,
): Promise<void> {
  await Click.createClick(request.body as CreateClickRequest);
  response.sendStatus(204);
}
