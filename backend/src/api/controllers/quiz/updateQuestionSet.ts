import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {QuizQuestionSet} from '../../../models/index.js';
import {
  type UpdateQuestionSetParameters,
  type UpdateQuestionSetRequest,
  type UpdateQuestionSetResponse,
} from '../../client/ApiTypes.js';

export async function updateQuestionSet(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateQuestionSetParameters;
  const data = request.body as UpdateQuestionSetRequest;

  const questionSet = await QuizQuestionSet.findById(id);
  if (!questionSet) {
    response.status(404).json({error: 'Question set not found'});
    return;
  }

  if (data.type) {
    questionSet.type = data.type;
  }

  if (data.title) {
    questionSet.title = data.title;
  }

  if (data.questions) {
    questionSet.questions = data.questions.map((question) => ({
      _id: question.id?.startsWith('new-')
        ? new mongoose.Types.ObjectId()
        : new mongoose.Types.ObjectId(question.id),
      instruction: question.instruction,
      explanation: question.explanation,
      multiSelect: question.multiSelect,
      strength: question.strength,
      choices: question.choices.map((choice) => ({
        _id: choice.id?.startsWith('new-')
          ? new mongoose.Types.ObjectId()
          : new mongoose.Types.ObjectId(choice.id),
        label: choice.label,
        isCorrect: choice.isCorrect,
        points: choice.points,
      })),
    }));
  }

  if (data.description) {
    questionSet.description = data.description;
  }

  await questionSet.save();

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
  } satisfies UpdateQuestionSetResponse);
}
