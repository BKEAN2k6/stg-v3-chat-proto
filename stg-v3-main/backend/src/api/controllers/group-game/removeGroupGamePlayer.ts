import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {GroupGame} from '../../../models/index.js';
import type {
  RemoveQuizPlayerParameters,
  PatchPlayerGroupGameEvent,
} from '../../client/ApiTypes.js';

export async function removeGroupGamePlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, playerId} = request.params as RemoveQuizPlayerParameters;

  const quizObjectId = new mongoose.Types.ObjectId(id);
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  const groupGame = await GroupGame.findOneAndUpdate(
    {_id: quizObjectId, 'players._id': playerObjectId},
    {$pull: {players: {_id: playerObjectId}}},
    {new: true},
  );

  if (!groupGame) {
    response.status(404).json({error: 'Quiz or player not found'});
    return;
  }

  await request.events.emit(`/group-games/${groupGame.id}/player`, 'patch', {
    players: groupGame.players.map((player) => player._id.toJSON()),
    updatedAt: groupGame.updatedAt!.toJSON(),
    isStarted: groupGame.isStarted,
  } satisfies PatchPlayerGroupGameEvent);

  response.sendStatus(204);
}
