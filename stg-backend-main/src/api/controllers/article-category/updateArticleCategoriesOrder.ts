import {type Request, type Response} from 'express';
import {type UpdateArticleCategoriesOrderRequest} from '../../client/ApiTypes';
import {ArticleCategory} from '../../../models';

export async function updateArticleCategoriesOrder(
  request: Request,
  response: Response,
): Promise<void> {
  const order = request.body as UpdateArticleCategoriesOrderRequest;

  await ArticleCategory.bulkWrite(
    order.map((_id, order) => ({
      updateOne: {
        filter: {_id},
        update: {order},
      },
    })),
  );

  response.sendStatus(204);
}
