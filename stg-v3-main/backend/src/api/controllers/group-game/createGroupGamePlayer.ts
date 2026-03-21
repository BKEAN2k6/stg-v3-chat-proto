import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {GroupGame} from '../../../models/index.js';
import {
  type CreateGroupGamePlayerRequest,
  type CreateGroupGamePlayerParameters,
  type PatchHostGroupGameEvent,
} from '../../client/ApiTypes.js';

export async function createGroupGamePlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateGroupGamePlayerParameters;

  const gameObjectId = new mongoose.Types.ObjectId(id);
  const {user} = request;
  const {nickname, color, avatar} =
    request.body as CreateGroupGamePlayerRequest;
  const _id = new mongoose.Types.ObjectId();

  const groupGame = await GroupGame.findOneAndUpdate(
    {_id: gameObjectId},
    {$addToSet: {players: {nickname, color, user, _id, avatar}}},
    {new: true},
  );

  if (!groupGame) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  request.session.groupGames ??= {};

  request.session.groupGames[id] = {playerId: _id.toString()};

  await request.events.emit(`/group-games/${groupGame.id}/host`, 'patch', {
    players: groupGame.players.map((player) => ({
      id: player._id.toJSON(),
      nickname: player.nickname,
      color: player.color,
      avatar: player.avatar,
    })),
    updatedAt: groupGame.updatedAt!.toJSON(),
  } satisfies PatchHostGroupGameEvent);

  response.status(201).json({
    id: _id.toJSON(),
    nickname,
    color,
    avatar,
  });
}
