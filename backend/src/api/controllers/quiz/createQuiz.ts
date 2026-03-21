import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz, QuizQuestionSet, Group, JoinCode} from '../../../models/index.js';
import {
  type CreateQuizParameters,
  type CreateQuizRequest,
  type CreateQuizResponse,
} from '../../client/ApiTypes.js';

export async function createQuiz(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: group} = request.params as CreateQuizParameters;
  const {questionSet} = request.body as CreateQuizRequest;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);

  if (!(await Group.exists({_id: group}))) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const set = await QuizQuestionSet.findById(questionSet);

  if (!set) {
    response.status(404).json({error: 'Question set not found'});
    return;
  }

  const joinCode = new JoinCode();
  await joinCode.generate();

  const quiz = await Quiz.create({
    group,
    createdBy,
    questionSet: set,
    currentQuestion: set.questions[0]._id,
    code: joinCode.code,
    codeActiveUntil: joinCode.codeActiveUntil,
  });

  joinCode.game = quiz._id;
  await joinCode.save();

  response.status(201).json({
    ...quiz.toJSON(),
    isCodeActive: quiz.codeActiveUntil > new Date(),
    currentQuestion: quiz.currentQuestion._id.toJSON(),
    players: quiz.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),

    answers: quiz.answers.map(({question, choices, player}) => ({
      question: question.toJSON(),
      choices: choices.map((c: typeof question) => c.toJSON()),
      player: player.toJSON(),
    })),

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
    updatedAt: quiz.updatedAt!.toJSON(),
  } satisfies CreateQuizResponse);
}
