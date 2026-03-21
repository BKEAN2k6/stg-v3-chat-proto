import {type Request, type Response} from 'express';
import {SprintResult, Sprint} from '../../../models';
import {
  type UpdateSprintRequest,
  type UpdateSprintParameters,
  type UpdateSprintResponse,
  type PatchPlayerSprintEvent,
} from '../../client/ApiTypes';

const MAX_PLAYERS_IN_ROOM = 10;

export async function updateSprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateSprintParameters;

  const sprint = await Sprint.findById(id);
  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  const {isStarted, isEnded} = request.body as UpdateSprintRequest;

  if (!sprint.isStarted && isStarted) {
    sprint.roomCount = Math.ceil(sprint.players.length / MAX_PLAYERS_IN_ROOM);
  }

  if (!sprint.isEnded && isEnded) {
    const strengthCounts: Record<string, number> = {};
    for (const sharedStrength of sprint.sharedStrengths) {
      const {strength} = sharedStrength;
      if (strength in strengthCounts) {
        strengthCounts[strength]++;
      } else {
        strengthCounts[strength] = 1;
      }
    }

    const strengths = Object.keys(strengthCounts).map((strength) => ({
      strength,
      count: strengthCounts[strength],
    }));

    if (strengths.length > 0) {
      await SprintResult.create({
        createdBy: sprint.createdBy,
        community: sprint.community,
        strengths,
      });
    }
  }

  sprint.isStarted = isStarted ? true : sprint.isStarted;
  sprint.isEnded = isEnded ? true : sprint.isEnded;

  await sprint.save();

  response.json(sprint.toJSON({virtuals: true}) satisfies UpdateSprintResponse);

  try {
    await request.events.emit(`/sprints/${id}/player`, 'patch', {
      isStarted: sprint.isStarted,
      isEnded: sprint.isEnded,
    } satisfies PatchPlayerSprintEvent);
  } catch (error) {
    request.logger.log(error);
  }
}
