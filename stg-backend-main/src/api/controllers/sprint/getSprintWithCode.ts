import {type Request, type Response} from 'express';
import {Sprint} from '../../../models';
import {
  type GetSprintWithCodeParameters,
  type GetSprintWithCodeResponse,
} from '../../client/ApiTypes';

export async function getSprintWithCode(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.params as GetSprintWithCodeParameters;

  const sprint = await Sprint.findOne({code});

  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  const sprintId = sprint._id.toHexString();
  const sprints = request.session.sprints;

  if (
    sprints?.[sprintId] &&
    !sprint.players.some((player) =>
      player._id.equals(sprints[sprintId]?.sprintPlayerId),
    )
  ) {
    delete sprints[sprintId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  const isRegistered = Boolean(request.session.sprints?.[sprintId]);

  response.json({
    _id: sprintId,
    isRegistered,
  } satisfies GetSprintWithCodeResponse);
}
