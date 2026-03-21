import {type Request, type Response} from 'express';
import {Article} from '../../../models/index.js';
import {type GetArticleHistoryParameters} from '../../client/ApiTypes.js';

export async function getArticleHistory(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetArticleHistoryParameters;

  const history = await Article.getHistoryById(id);

  response.json(history.toJSON({virtuals: true}));
}
