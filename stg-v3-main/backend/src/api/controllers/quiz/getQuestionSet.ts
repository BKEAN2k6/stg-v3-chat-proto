import {type Request, type Response} from 'express';
import {QuizQuestionSet} from '../../../models/index.js';
import {
  type GetQuestionSetParameters,
  type GetQuestionSetResponse,
} from '../../client/ApiTypes.js';

export async function getQuestionSet(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetQuestionSetParameters;

  const questionSet = await QuizQuestionSet.findById(id);

  if (!questionSet) {
    response.status(404).json({error: 'Question set not found'});
    return;
  }

  response.status(200).json({
    id: questionSet._id.toJSON(),
    type: questionSet.type,
    title: questionSet.title,
    description: questionSet.description,
    questions: questionSet.questions.map(
      ({_id, instruction, explanation, multiSelect, strength, choices}) => ({
        id: _id.toJSON(),
        instruction,
        explanation,
        multiSelect,
        strength,
        choices: choices.map(({_id, label, isCorrect, points}) => ({
          id: _id.toJSON(),
          label,
          isCorrect,
          points,
        })),
      }),
    ),
  } satisfies GetQuestionSetResponse);
}
