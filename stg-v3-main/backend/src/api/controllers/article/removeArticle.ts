import {type Request, type Response} from 'express';
import {Article} from '../../../models/index.js';

export async function removeArticle(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as {id: string};

  const article = await Article.findById(id);
  if (!article) {
    response.status(404).json({error: 'Article not found'});
    return;
  }

  await article.deleteOne();

  response.sendStatus(204);
}
