import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint} from '../../../models';
import {
  type CreateSprintPlayerRequest,
  type CreateSprintPlayerParameters,
  type CreateSprintPlayerResponse,
} from '../../client/ApiTypes';

export async function createSprintPlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateSprintPlayerParameters;

  if (request.session.sprints?.[id]) {
    response.status(400).json({error: 'Player already exists'});
    return;
  }

  const sprintObjectId = new mongoose.Types.ObjectId(id);
  const {nickname, color, avatar} = request.body as CreateSprintPlayerRequest;
  const _id = new mongoose.Types.ObjectId();

  const sprint = await Sprint.findOneAndUpdate(
    {_id: sprintObjectId, 'players.nickname': {$ne: nickname}},
    {$addToSet: {players: {nickname, color, avatar, _id}}},
    {new: true},
  );

  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  request.session.sprints ||= {};

  request.session.sprints[id] = {sprintPlayerId: _id.toString()};

  response.status(201).json({
    _id: _id.toHexString(),
    nickname,
    color,
    avatar,
  } satisfies CreateSprintPlayerResponse);

  try {
    await request.events.emit(`/sprints/${id}/host`, 'patch', {
      players: sprint.players,
    });
  } catch (error) {
    request.logger.log(error);
  }
}
