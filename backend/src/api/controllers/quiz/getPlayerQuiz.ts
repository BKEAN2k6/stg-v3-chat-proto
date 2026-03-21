import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz} from '../../../models/index.js';
import {
  type GetPlayerQuizParameters,
  type GetPlayerQuizResponse,
} from '../../client/ApiTypes.js';

export async function getPlayerQuiz(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPlayerQuizParameters;

  if (!request.session.groupGames?.[id]) {
    response.status(404).json({error: 'Memory game not found from session'});
    return;
  }

  const {playerId} = request.session.groupGames[id];
  const userObjectId = new mongoose.Types.ObjectId(playerId);

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  const playerIndex = quiz.players.findIndex((player) =>
    player._id.equals(userObjectId),
  );
  const player = quiz.players[playerIndex];

  if (!player) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete request.session.groupGames[id];
    response.status(404).json({error: 'Player not found'});
    return;
  }

  response.json({
    ...quiz.toJSON(),
    player: {
      id: player._id.toJSON(),
      nickname: player.nickname,
      color: player.color,
      avatar: player.avatar,
    },
    players: quiz.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    currentQuestion: quiz.currentQuestion._id.toJSON(),
    answers: quiz.answers
      .filter(({player}) => player._id.equals(userObjectId))
      .map(({question, choices, _id}) => ({
        question: question.toJSON(),
        choices: (choices ?? []).map((c: mongoose.Types.ObjectId) =>
          typeof (c as any)?.toHexString === 'function'
            ? c.toJSON()
            : (c as unknown as string),
        ),
        id: _id.toJSON(),
      })),
    questionSet: {
      type: quiz.questionSet.type,
      title: quiz.questionSet.title,
      description: quiz.questionSet.description,
      questions: quiz.questionSet.questions.map(
        ({_id, strength, instruction, explanation, multiSelect, choices}) => ({
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
  } satisfies GetPlayerQuizResponse);
}
