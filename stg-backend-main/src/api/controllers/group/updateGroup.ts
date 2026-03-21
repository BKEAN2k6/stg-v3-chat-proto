import {type Request, type Response} from 'express';
import {Group} from '../../../models';
import {type UpdateGroupRequest} from '../../client/ApiTypes';

export async function updateGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const group = await Group.findById(request.params.id);
  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const {name, description} = request.body as UpdateGroupRequest;

  if (name) {
    group.name = name;
  }

  if (description) {
    group.description = description;
  }

  await group.save();

  response.json(group);
}
