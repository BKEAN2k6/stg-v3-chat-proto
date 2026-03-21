import {type Request, type Response} from 'express';
import {Sprint} from '../../../models/index.js';
import {
  type GetHostSprintParameters,
  type GetHostSprintResponse,
} from '../../client/ApiTypes.js';

export async function getHostSprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetHostSprintParameters;

  const sprint = await Sprint.findById(id);
  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  response.json({
    ...sprint.toJSON(),
    isCodeActive: sprint.codeActiveUntil > new Date(),
    isCompleted: sprint.isCompleted,
    expectedStrengthCount: sprint.expectedStrengthCount,
    players: sprint.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    sharedStrengths: sprint.sharedStrengths.map(({strength, from, to}) => ({
      strength,
      from: from.toJSON(),
      to: to.toJSON(),
    })),
    updatedAt: sprint.updatedAt!.toJSON(),
  } satisfies GetHostSprintResponse);
}
