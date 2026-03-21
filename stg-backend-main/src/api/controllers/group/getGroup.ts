import {type Request, type Response} from 'express';
import {Group} from '../../../models';
import {type GetGroupParameters} from '../../client/ApiTypes';

export async function getGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetGroupParameters;

  const group = await Group.findById(id);
  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  response.json(group);
}
