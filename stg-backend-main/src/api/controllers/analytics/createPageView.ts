import {type Request, type Response} from 'express';
import {PageView} from '../../../models';
import {type CreatePageViewRequest} from '../../client/ApiTypes';

export async function createPageView(
  request: Request,
  response: Response,
): Promise<void> {
  await PageView.createPageView(request.body as CreatePageViewRequest);
  response.sendStatus(204);
}
