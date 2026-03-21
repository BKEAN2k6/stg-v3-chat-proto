import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint} from '../../../models/index.js';
import {
  type GetPlayerSprintParameters,
  type GetPlayerSprintResponse,
} from '../../client/ApiTypes.js';

export async function getPlayerSprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPlayerSprintParameters;

  if (!request.session.groupGames?.[id]) {
    response.status(404).json({error: 'Sprint not found from session'});
    return;
  }

  const {playerId} = request.session.groupGames[id];
  const userObjectId = new mongoose.Types.ObjectId(playerId);

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
    delete request.session.groupGames[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
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
      const givenStrength = sprint.sharedStrengths.find(
        (strength) =>
          strength.from.equals(userObjectId) && strength.to.equals(player._id),
      );
      const strength = givenStrength?.strength;
      const {nickname, _id, avatar, color} = player;
      return {_id: _id.toJSON(), nickname, avatar, color, strength};
    });

  const {_id, isEnded} = sprint;
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
      from: {nickname, _id: _id.toJSON()},
    };
  });

  const players = sprint.players.map((player) => player._id.toJSON());

  response.json({
    id: _id.toJSON(),
    player: {
      id: player._id.toJSON(),
      nickname: player.nickname,
      color: player.color,
      avatar: player.avatar,
    },
    players,
    room: room.map(({_id, nickname, avatar, color, strength}) => ({
      id: _id,
      nickname,
      avatar,
      color,
      strength,
    })),
    receivedStrengths: receivedStrengths.map(({strength, from}) => ({
      strength,
      from: {
        id: from._id,
        nickname: from.nickname,
      },
    })),
    isEnded,
    isCompleted: sprint.isCompleted,
    updatedAt: sprint.updatedAt!.toJSON(),
  } satisfies GetPlayerSprintResponse);
}
