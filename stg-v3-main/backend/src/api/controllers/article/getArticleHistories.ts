import {type Request, type Response} from 'express';
import {Article} from '../../../models/index.js';
import {type GetArticleHistoriesParameters} from '../../client/ApiTypes.js';

export async function getArticleHistories(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetArticleHistoriesParameters;

  const article = await Article.findById(id);

  if (!article) {
    response.status(404).json({error: 'Content video not found'});
    return;
  }

  const history = await article.getHistory();

  // Explicitly type the items and the result of toJSON
  type HistoryItem = typeof history extends Array<infer U> ? U : never;
  type HistoryItemJSON = ReturnType<HistoryItem['toJSON']>;

  response.json(
    history.map(
      (item: HistoryItem): HistoryItemJSON =>
        item.toJSON({virtuals: true}) as HistoryItemJSON,
    ),
  );
}
