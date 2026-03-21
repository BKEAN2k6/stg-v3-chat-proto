import {type Request, type Response} from 'express';
import {Quiz} from '../../../models/index.js';
import {
  type GetHostQuizParameters,
  type GetHostQuizResponse,
} from '../../client/ApiTypes.js';

export async function getHostQuiz(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetHostQuizParameters;

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  response.json({
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
  } satisfies GetHostQuizResponse);
}
