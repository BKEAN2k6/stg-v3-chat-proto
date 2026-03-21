import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {JoinCode} from '../../../models/index.js';
import {
  type GetGroupGameWithCodeResponse,
  type GetGroupGameWithCodeParameters,
} from '../../client/ApiTypes.js';

export async function getGroupGameWithCode(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.params as GetGroupGameWithCodeParameters;

  const joinCode = await JoinCode.findOne({code}).populate('game');

  if (!joinCode) {
    response.status(404).json({error: 'Code not found or expired'});
    return;
  }

  if (!isDocument(joinCode.game)) {
    throw new Error('Game not populated');
  }

  const groupGame = joinCode.game;

  const groupGameId = groupGame._id.toJSON();
  const {groupGames} = request.session;

  if (
    groupGames?.[groupGameId] &&
    !groupGame.players.some((player) =>
      player._id.equals(groupGames[groupGameId]?.playerId),
    )
  ) {
    delete groupGames[groupGameId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  const player = groupGame.players.find((player) =>
    player._id.equals(request.session.groupGames?.[groupGameId]?.playerId),
  );

  response.json({
    id: groupGameId,
    gameType: groupGame.gameType,
    player: player
      ? {
          id: player._id.toJSON(),
          nickname: player.nickname,
          color: player.color,
          avatar: player.avatar,
        }
      : undefined,
    players: groupGame.players.map((player) => player._id.toJSON()),
    isStarted: groupGame.isStarted,
    updatedAt: groupGame.updatedAt!.toJSON(),
  } satisfies GetGroupGameWithCodeResponse);
}
