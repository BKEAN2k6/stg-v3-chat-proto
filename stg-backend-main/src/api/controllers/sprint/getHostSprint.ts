import {type Request, type Response} from 'express';
import {Sprint} from '../../../models';
import {
  type GetHostSprintParameters,
  type GetHostSprintResponse,
} from '../../client/ApiTypes';

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

  response.json(
    sprint.toJSON({virtuals: true}) satisfies GetHostSprintResponse,
  );
}
