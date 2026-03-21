import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Sprint, Group, JoinCode} from '../../../models/index.js';
import {
  type CreateSprintParameters,
  type CreateSprintResponse,
} from '../../client/ApiTypes.js';

export async function createSprint(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: groupId} = request.params as CreateSprintParameters;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);

  if (!(await Group.exists({_id: groupId}))) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const joinCode = new JoinCode();
  await joinCode.generate();

  const sprint = await Sprint.create({
    group: groupId,
    createdBy,
    code: joinCode.code,
    codeActiveUntil: joinCode.codeActiveUntil,
  });

  joinCode.game = sprint._id;
  await joinCode.save();

  response.status(201).json(sprint.toJSON() satisfies CreateSprintResponse);
}
