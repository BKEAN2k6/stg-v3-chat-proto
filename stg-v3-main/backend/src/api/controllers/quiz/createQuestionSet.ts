import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {QuizQuestionSet} from '../../../models/index.js';
import {
  type CreateQuestionSetRequest,
  type CreateQuestionSetResponse,
} from '../../client/ApiTypes.js';

export async function createQuestionSet(
  request: Request,
  response: Response,
): Promise<void> {
  const data = request.body as CreateQuestionSetRequest;

  const questionSet = await QuizQuestionSet.create({
    ...data,
    questions: data.questions.map((q) => ({
      ...q,
      _id: new mongoose.Types.ObjectId(),
      choices: q.choices.map((c) => ({
        ...c,
        _id: new mongoose.Types.ObjectId(),
      })),
    })),
  });

  response.status(201).json({
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
  } satisfies CreateQuestionSetResponse);
}
