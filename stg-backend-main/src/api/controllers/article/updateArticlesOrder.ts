import {type Request, type Response} from 'express';
import {type UpdateArticlesOrderRequest} from '../../client/ApiTypes';
import {Article} from '../../../models';

export async function updateArticlesOrder(
  request: Request,
  response: Response,
): Promise<void> {
  const order = request.body as UpdateArticlesOrderRequest;

  await Article.bulkWrite(
    order.map((_id, order) => ({
      updateOne: {
        filter: {_id},
        update: {order},
      },
    })),
  );

  response.sendStatus(204);
}
