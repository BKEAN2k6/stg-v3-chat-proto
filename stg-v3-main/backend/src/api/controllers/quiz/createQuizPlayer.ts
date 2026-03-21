import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz} from '../../../models/index.js';
import {
  type CreateQuizPlayerRequest,
  type CreateQuizPlayerParameters,
  type CreateQuizPlayerResponse,
  type PatchHostQuizEvent,
} from '../../client/ApiTypes.js';

export async function createQuizPlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateQuizPlayerParameters;

  if (request.session.groupGames?.[id]) {
    response.status(400).json({error: 'Player already exists'});
    return;
  }

  const gameObjectId = new mongoose.Types.ObjectId(id);
  const {user} = request;
  const {nickname, color, avatar} = request.body as CreateQuizPlayerRequest;
  const _id = new mongoose.Types.ObjectId();

  const quiz = await Quiz.findOneAndUpdate(
    {_id: gameObjectId, 'players.nickname': {$ne: nickname}},
    {$addToSet: {players: {nickname, color, user, _id, avatar}}},
    {new: true},
  );

  if (!quiz) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  request.session.groupGames ??= {};

  request.session.groupGames[id] = {playerId: _id.toString()};

  response.status(201).json({
    id: _id.toJSON(),
    nickname,
    color,
    avatar,
  } satisfies CreateQuizPlayerResponse);

  try {
    await request.events.emit(`/quizzes/${quiz.id}/host`, 'patch', {
      answers: quiz.answers.map(({question, choices, player}) => ({
        question: question.toJSON(),
        choices: choices.map((c) => c.toJSON()),
        player: player.toJSON(),
      })),
      players: quiz.players.map((player) => ({
        id: player._id.toJSON(),
        nickname: player.nickname,
        color: player.color,
        avatar: player.avatar,
      })),
      updatedAt: quiz.updatedAt!.toJSON(),
    } satisfies PatchHostQuizEvent);
  } catch (error) {
    request.error = error;
  }
}
