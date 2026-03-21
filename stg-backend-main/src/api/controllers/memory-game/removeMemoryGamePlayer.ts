import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models';
import type {
  PatchMemoryGameEvent,
  RemoveMemoryGamePlayerParameters,
} from '../../client/ApiTypes';

export async function removeMemoryGamePlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, playerId} = request.params as RemoveMemoryGamePlayerParameters;

  const memoryGameObjectId = new mongoose.Types.ObjectId(id);
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  const memoryGame = await MemoryGame.findOneAndUpdate(
    {_id: memoryGameObjectId, 'players._id': playerObjectId},
    {$pull: {players: {_id: playerObjectId}}},
    {new: true},
  );

  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame or player not found'});
    return;
  }

  response.sendStatus(204);

  try {
    await request.events.emit(`/memory-games/${id}/player`, 'patch', {
      players: memoryGame.players.map((player) => {
        return {
          _id: player._id.toHexString(),
          nickname: player.nickname,
          color: player.color,
        };
      }),
    } satisfies PatchMemoryGameEvent);
  } catch (error) {
    request.logger.log(error);
  }
}
