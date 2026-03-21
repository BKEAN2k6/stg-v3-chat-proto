import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint} from '../../../models';
import {
  type GetPlayerSprintParameters,
  type GetPlayerSprintResponse,
} from '../../client/ApiTypes';

export async function getPlayerSprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPlayerSprintParameters;

  if (!request.session.sprints?.[id]) {
    response.status(404).json({error: 'Sprint not found from session'});
    return;
  }

  const sprintPlayerId = request.session.sprints[id].sprintPlayerId;
  const userObjectId = new mongoose.Types.ObjectId(sprintPlayerId);

  const sprint = await Sprint.findById(id);

  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  const playerIndex = sprint.players.findIndex((player) =>
    player._id.equals(userObjectId),
  );
  const player = sprint.players[playerIndex];

  if (!player) {
    delete request.session.sprints[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    response.status(404).json({error: 'Player not found'});
    return;
  }

  const roomNumber = playerIndex % sprint.roomCount;
  const room = sprint.players
    .filter(
      (_, index) =>
        index % sprint.roomCount === roomNumber && index !== playerIndex,
    )
    .map((player) => {
      const givenSterngth = sprint.sharedStrengths.find(
        (strength) =>
          strength.from.equals(userObjectId) && strength.to.equals(player._id),
      );
      const strength = givenSterngth?.strength;
      const {nickname, _id, avatar, color} = player;
      return {_id: _id.toHexString(), nickname, avatar, color, strength};
    });

  const {_id, isStarted, isEnded} = sprint;
  const strengths = sprint.sharedStrengths.filter((strength) =>
    strength.to.equals(userObjectId),
  );

  const receivedStrengths = strengths.map((strength) => {
    const from = sprint.players.find((player) =>
      player._id.equals(strength.from),
    );
    if (!from) {
      throw new Error('Player not found');
    }

    const {nickname, _id} = from;
    return {
      strength: strength.strength,
      from: {nickname, _id: _id.toHexString()},
    };
  });

  const players = sprint.players.map((player) => player._id.toHexString());

  response.json({
    _id: _id.toHexString(),
    player: {
      _id: player._id.toHexString(),
      nickname: player.nickname,
      color: player.color,
      avatar: player.avatar,
    },
    players,
    room,
    receivedStrengths,
    isStarted,
    isEnded,
    isCompleted: sprint.isCompleted,
  } satisfies GetPlayerSprintResponse);
}
