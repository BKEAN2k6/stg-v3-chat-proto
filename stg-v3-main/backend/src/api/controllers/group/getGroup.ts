import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Group} from '../../../models/index.js';
import {
  type GetGroupParameters,
  type GetGroupResponse,
} from '../../client/ApiTypes.js';

export async function getGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetGroupParameters;

  const group = await Group.findById(id).populate([
    {
      path: 'owner',
      select: '_id firstName lastName avatar',
    },
  ]);

  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  if (!isDocument(group.owner)) {
    throw new Error('Owner is not populated');
  }

  response.json({
    ...group.toJSON(),
    owner: group.owner.toJSON(),
    articleProgress: group.articleProgress.map((p) => ({
      article: p.article._id.toString(),
      completionDate: p.completionDate.toJSON(),
    })),
  } satisfies GetGroupResponse);
}
