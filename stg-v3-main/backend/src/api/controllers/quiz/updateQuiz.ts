import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {Quiz} from '../../../models/index.js';
import {type Quiz as QuizModel} from '../../../models/GroupGame/Quiz.js';
import {
  type UpdateQuizRequest,
  type UpdateQuizParameters,
  type UpdateQuizResponse,
  type PatchPlayerQuizEvent,
} from '../../client/ApiTypes.js';

export async function updateQuiz(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateQuizParameters;

  const previous = await Quiz.findById(id).select('_id isEnded').lean();
  if (!previous) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  const previousIsEnded = Boolean(previous.isEnded);

  const {isStarted, isEnded, currentQuestion, canAnswer, answers} =
    request.body as UpdateQuizRequest;

  const $set: Record<string, unknown> = {};
  if (typeof isStarted === 'boolean') $set.isStarted = isStarted;
  if (typeof isEnded === 'boolean') $set.isEnded = isEnded;
  if (typeof canAnswer === 'boolean') $set.canAnswer = canAnswer;
  if (Array.isArray(answers)) $set.answers = answers;

  let currentQuestionObjectId: mongoose.Types.ObjectId | undefined;
  if (currentQuestion) {
    try {
      currentQuestionObjectId = new mongoose.Types.ObjectId(currentQuestion);
      $set.currentQuestion = currentQuestionObjectId;
    } catch {
      response.status(400).json({error: 'Invalid currentQuestion id'});
      return;
    }
  }

  if (Object.keys($set).length === 0) {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      response.status(404).json({error: 'Quiz not found'});
      return;
    }

    return respondWithQuiz(response, request, quiz);
  }

  const filter: Record<string, unknown> = {_id: id};
  if (currentQuestionObjectId) {
    filter['questionSet.questions._id'] = currentQuestionObjectId;
  }

  const quiz = await Quiz.findOneAndUpdate(
    filter,
    {$set},
    {
      new: true, // Return the updated doc
      runValidators: true,
    },
  );

  if (!quiz) {
    response.status(400).json({error: 'Current question not found in quiz'});
    return;
  }

  if (!previousIsEnded && quiz.isEnded) {
    try {
      await quiz.updateStats();
    } catch (error) {
      request.error = error;
    }
  }

  await respondWithQuiz(response, request, quiz);
}

async function respondWithQuiz(
  response: Response,
  request: Request,
  quiz: DocumentType<QuizModel>,
) {
  const currentQuestion =
    quiz.currentQuestion?._id?.toHexString?.() ??
    (
      quiz.currentQuestion as unknown as mongoose.Types.ObjectId | undefined
    )?.toHexString?.() ??
    null;

  response.json({
    ...quiz.toJSON(),
    isCodeActive: quiz.codeActiveUntil > new Date(),
    questionSet: {
      title: quiz.questionSet.title,
      type: quiz.questionSet.type,
      description: quiz.questionSet.description,
      questions: quiz.questionSet.questions.map(
        ({_id, instruction, explanation, multiSelect, choices, strength}) => ({
          id: _id.toJSON(),
          strength,
          instruction,
          explanation,
          multiSelect,
          choices: choices.map(({_id, label, isCorrect, points}) => ({
            id: _id.toJSON(),
            label,
            isCorrect,
            points,
          })),
        }),
      ),
    },
    players: quiz.players.map(({_id, color, nickname, avatar}) => ({
      id: _id.toJSON(),
      color,
      nickname,
      avatar,
    })),

    answers: quiz.answers.map(({question, choices, player}) => ({
      question: question.toJSON(),
      choices: (choices ?? []).map((c: mongoose.Types.ObjectId) => c.toJSON()),
      player: player.toJSON(),
    })),
    currentQuestion,
    updatedAt: quiz.updatedAt!.toJSON(),
  } satisfies UpdateQuizResponse);

  try {
    await request.events.emit(`/quizzes/${quiz.id}/player`, 'patch', {
      isStarted: quiz.isStarted,
      isEnded: quiz.isEnded,
      currentQuestion,
      canAnswer: quiz.canAnswer,
    } satisfies PatchPlayerQuizEvent);
  } catch (error) {
    request.error = error;
  }
}
