import {type Request, type Response} from 'express';
import {QuizQuestionSet} from '../../../models/index.js';
import {type UpdateQuestionSetParameters} from '../../client/ApiTypes.js';

export async function removeQuestionSet(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateQuestionSetParameters;

  const questionSet = await QuizQuestionSet.findById(id);
  if (!questionSet) {
    response.status(404).json({error: 'Question set not found'});
    return;
  }

  await questionSet.deleteOne();
  response.sendStatus(204);
}
