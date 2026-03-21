import {type Request, type Response} from 'express';
import {GroupGame} from '../../../models/index.js';
import {
  type UpdateQuizRequest,
  type UpdateQuizParameters,
  type UpdateGroupGameResponse,
  type PatchPlayerGroupGameEvent,
} from '../../client/ApiTypes.js';

export async function updateGroupGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateQuizParameters;

  const {isStarted} = request.body as UpdateQuizRequest;

  const groupGame = await GroupGame.findById(id);
  if (!groupGame) {
    response.status(404).json({error: 'GroupGame not found'});
    return;
  }

  if (isStarted !== undefined) {
    groupGame.isStarted = isStarted;
  }

  await groupGame.save();

  response.json({
    ...groupGame.toJSON(),
    players: groupGame.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    updatedAt: groupGame.updatedAt!.toJSON(),
  } satisfies UpdateGroupGameResponse);

  await request.events.emit(`/group-games/${groupGame.id}/player`, 'patch', {
    players: groupGame.players.map((player) => player._id.toJSON()),
    updatedAt: groupGame.updatedAt!.toJSON(),
    isStarted: groupGame.isStarted,
  } satisfies PatchPlayerGroupGameEvent);
}
