import {type Request, type Response} from 'express';
import {Group} from '../../../models/index.js';
import {type RemoveGroupArticleProgressParameters} from '../../client/ApiTypes.js';

export async function removeGroupArticleProgress(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, article} = request.params as RemoveGroupArticleProgressParameters;

  await Group.findByIdAndUpdate(id, {
    $pull: {
      articleProgress: {
        article,
      },
    },
  });

  response.sendStatus(204);
}
