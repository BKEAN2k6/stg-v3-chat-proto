import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {Group} from '../../../models/index.js';
import {
  type UpdateGroupRequest,
  type UpdateGroupResponse,
} from '../../client/ApiTypes.js';

export async function updateGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const group = await Group.findById(request.params.id);
  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const {name, description, owner, language, ageGroup} =
    request.body as UpdateGroupRequest;

  if (name) {
    group.name = name;
  }

  if (description) {
    group.description = description;
  }

  if (owner) {
    group.owner = new mongoose.Types.ObjectId(owner);
  }

  if (language) {
    group.language = language;
  }

  if (ageGroup) {
    group.ageGroup = ageGroup;
  }

  await group.save();

  await group.populate([
    {
      path: 'owner',
      select: '_id firstName lastName avatar',
    },
  ]);

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
  } satisfies UpdateGroupResponse);
}
