import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint} from '../../../models';
import type {PatchPlayerSprintEvent} from '../../client/ApiTypes';

export async function removeSprintPlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, playerId} = request.params as {
    id: string;
    playerId: string;
  };

  const sprintObjectId = new mongoose.Types.ObjectId(id);
  const playerObjectId = new mongoose.Types.ObjectId(playerId);

  const sprint = await Sprint.findOneAndUpdate(
    {_id: sprintObjectId, 'players._id': playerObjectId},
    {$pull: {players: {_id: playerObjectId}}},
    {new: true},
  );

  if (!sprint) {
    response.status(404).json({error: 'Sprint or player not found'});
    return;
  }

  response.sendStatus(204);

  try {
    await request.events.emit(`/sprints/${id}/player`, 'patch', {
      players: sprint.players.map((player) => player._id.toHexString()),
    } satisfies PatchPlayerSprintEvent);
  } catch (error) {
    request.logger.log(error);
  }
}
