import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz} from '../../../models/index.js';
import {
  type RemoveQuizAnswerParameters,
  type PatchHostQuizEvent,
} from '../../client/ApiTypes.js';

export async function removeQuizAnswer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, answerId} = request.params as RemoveQuizAnswerParameters;

  if (!request.session.groupGames?.[id]) {
    response.status(404).json({error: 'Quiz not found from session'});
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

  if (playerIndex === -1 || !quiz.players[playerIndex]) {
    delete request.session.groupGames[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    response.status(404).json({error: 'Player not found'});
    return;
  }

  const updatedQuiz = await Quiz.findOneAndUpdate(
    {_id: quiz._id},
    {
      $pull: {
        answers: {
          _id: new mongoose.Types.ObjectId(answerId),
          player: userObjectId,
        },
      },
    },
    {new: true},
  );

  if (!updatedQuiz) {
    response.status(404).json({error: 'Quiz not found after update'});
    return;
  }

  response.sendStatus(204);

  try {
    await request.events.emit(`/quizzes/${quiz.id}/host`, 'patch', {
      answers: updatedQuiz.answers.map(({question, choices, player}) => ({
        question: question.toJSON(),
        choices: (choices ?? []).map((c: mongoose.Types.ObjectId) =>
          c.toJSON(),
        ),
        player: player.toJSON(),
      })),
      players: updatedQuiz.players.map((player) => ({
        id: player._id.toJSON(),
        nickname: player.nickname,
        color: player.color,
        avatar: player.avatar,
      })),
      updatedAt: updatedQuiz.updatedAt!.toJSON(),
    } satisfies PatchHostQuizEvent);
  } catch (error) {
    request.error = error;
  }
}
