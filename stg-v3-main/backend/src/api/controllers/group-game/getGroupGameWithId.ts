import {type Request, type Response} from 'express';
import {GroupGame} from '../../../models/index.js';
import {
  type GetGroupGameWithIdParameters,
  type GetGroupGameWithIdResponse,
} from '../../client/ApiTypes.js';

export async function getGroupGameWithId(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetGroupGameWithIdParameters;

  const game = await GroupGame.findById(id);
  if (!game) {
    response.status(404).json({error: 'Game not found'});
    return;
  }

  response.json({
    ...game.toJSON(),
    isCodeActive: game.codeActiveUntil > new Date(),
    players: game.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    updatedAt: game.updatedAt!.toJSON(),
  } satisfies GetGroupGameWithIdResponse);
}
