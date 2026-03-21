import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz} from '../../../models/index.js';
import type {
  RemoveQuizPlayerParameters,
  PatchHostQuizEvent,
} from '../../client/ApiTypes.js';

export async function removeQuizPlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, playerId} = request.params as RemoveQuizPlayerParameters;

  const quizObjectId = new mongoose.Types.ObjectId(id);
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  const quiz = await Quiz.findOneAndUpdate(
    {_id: quizObjectId, 'players._id': playerObjectId},
    {$pull: {players: {_id: playerObjectId}}},
    {new: true},
  );

  if (!quiz) {
    response.status(404).json({error: 'Quiz or player not found'});
    return;
  }

  response.sendStatus(204);

  try {
    await request.events.emit(`/quizzes/${id}/player`, 'patch', {
      players: quiz.players.map((player) => {
        return {
          id: player._id.toJSON(),
          nickname: player.nickname,
          color: player.color,
          avatar: player.avatar,
        };
      }),
      answers: quiz.answers.map(({question, choices, player}) => ({
        question: question.toJSON(),
        choices: choices.map((c) => c.toJSON()),
        player: player.toJSON(),
      })),
      updatedAt: quiz.updatedAt!.toJSON(),
    } satisfies PatchHostQuizEvent);
  } catch (error) {
    request.error = error;
  }
}
