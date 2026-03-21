import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models';
import {
  type CreateMemoryGamePlayerRequest,
  type CreateMemoryGamePlayerParameters,
  type CreateMemoryGamePlayerResponse,
} from '../../client/ApiTypes';

export async function createMemoryGamePlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateMemoryGamePlayerParameters;

  if (request.session.memoryGames?.[id]) {
    response.status(400).json({error: 'Player already exists'});
    return;
  }

  const gameObjectId = new mongoose.Types.ObjectId(id);
  const user = request.user;
  const {nickname, color} = request.body as CreateMemoryGamePlayerRequest;
  const _id = new mongoose.Types.ObjectId();

  const memoryGame = await MemoryGame.findOneAndUpdate(
    {_id: gameObjectId, 'players.nickname': {$ne: nickname}},
    {$addToSet: {players: {nickname, color, user, _id}}},
    {new: true},
  );

  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame not found'});
    return;
  }

  request.session.memoryGames ||= {};

  request.session.memoryGames[id] = {memoryGamePlayerId: _id.toString()};

  response.status(201).json({
    _id: _id.toHexString(),
    nickname,
    color,
  } satisfies CreateMemoryGamePlayerResponse);

  try {
    await request.events.emit(`/memory-games/${id}`, 'patch', {
      players: memoryGame.players,
    });
  } catch (error) {
    request.logger.log(error);
  }
}
