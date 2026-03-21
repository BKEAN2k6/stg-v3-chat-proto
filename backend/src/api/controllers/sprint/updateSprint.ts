import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Sprint, SprintResult} from '../../../models/index.js';
import {
  type UpdateSprintRequest,
  type UpdateSprintParameters,
  type UpdateSprintResponse,
  type PatchPlayerSprintEvent,
} from '../../client/ApiTypes.js';

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

  const {isEnded} = request.body as UpdateSprintRequest;

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

    await Sprint.populate(sprint, {
      path: 'group',
      select: 'name community',
    });

    if (!isDocument(sprint.group)) {
      throw new Error('Group not found');
    }

    if (strengths.length > 0) {
      await SprintResult.create({
        createdBy: sprint.createdBy,
        community: sprint.group.community,
        groupName: sprint.group.name,
        strengths,
      });
      await request.stats.updateCommunityStrenghts(
        sprint.group.community._id.toJSON(),
        sprint.createdAt!,
        sprint.sharedStrengths.map(({strength}) => strength),
      );
    }
  }

  sprint.isEnded = isEnded ? true : sprint.isEnded;

  await sprint.save();

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
  } satisfies UpdateSprintResponse);

  try {
    await request.events.emit(`/sprints/${id}/player`, 'patch', {
      ...sprint.toJSON(),
      isStarted: sprint.isStarted,
      isCompleted: sprint.isCompleted,
      isEnded: sprint.isEnded,
      updatedAt: sprint.updatedAt!.toJSON(),
      players: sprint.players.map(({_id}) => _id.toJSON()),
    } satisfies PatchPlayerSprintEvent);
  } catch (error) {
    request.error = error;
  }
}
