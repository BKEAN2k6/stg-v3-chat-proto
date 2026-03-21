import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint} from '../../../models';
import {
  type CreateSprintStrengthRequest,
  type CreateSprintStrengthParameters,
  type CreateSprintStrengthResponse,
  type PatchHostSprintEvent,
  type PatchPlayerSprintEvent,
} from '../../client/ApiTypes';

export async function createSprintStrength(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateSprintStrengthParameters;

  if (!request.session.sprints?.[id]) {
    response.status(404).json({error: 'Sprint not found from session'});
    return;
  }

  const {strength, to} = request.body as CreateSprintStrengthRequest;
  const sprintPlayerId = request.session.sprints[id].sprintPlayerId;
  const sprintObjectId = new mongoose.Types.ObjectId(id);
  const toObjectId = new mongoose.Types.ObjectId(to);
  const fromObjectId = new mongoose.Types.ObjectId(sprintPlayerId);
  const sharedStrength = {strength, to: toObjectId, from: fromObjectId};

  await Sprint.updateOne(
    {_id: sprintObjectId},
    {$pull: {sharedStrengths: {to: toObjectId, from: fromObjectId}}},
  );

  const sprint = await Sprint.findOneAndUpdate(
    {_id: sprintObjectId},
    {$addToSet: {sharedStrengths: sharedStrength}},
    {new: true},
  );

  if (!sprint) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  const {isCompleted, sharedStrengths} = sprint;

  response.status(201).json({
    strength,
    to,
  } satisfies CreateSprintStrengthResponse);

  try {
    await request.events.emit(`/sprints/${id}/host`, 'patch', {
      sharedStrengths: sharedStrengths.map(({strength, to, from}) => ({
        strength,
        to: to.toHexString(),
        from: from.toHexString(),
      })),
      // We only want to send isCompleted if it's true to prevent race conditions in the client
      ...(isCompleted ? {isCompleted} : {}),
    } satisfies PatchHostSprintEvent);

    if (isCompleted) {
      await request.events.emit(`/sprints/${id}/player`, 'patch', {
        isCompleted,
      } satisfies PatchPlayerSprintEvent);
    }
  } catch (error) {
    request.logger.log(error);
  }
}
