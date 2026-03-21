import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {
  Community,
  Group,
  CommunityMembership,
  User,
} from '../../../models/index.js';
import {
  type CreateCommunityGroupRequest,
  type CreateCommunityGroupResponse,
  type CreateCommunityGroupParameters,
  type LanguageCode,
} from '../../client/ApiTypes.js';

export async function createCommunityGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, description, owner} =
    request.body as CreateCommunityGroupRequest;
  const {id} = request.params as CreateCommunityGroupParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const membership = await CommunityMembership.findOne({
    community: community._id,
    user: request.user.id,
  });

  if (!membership) {
    response
      .status(400)
      .json({error: 'Owner is not a a member of this community'});
    return;
  }

  const group = await Group.create({
    name,
    description,
    community: community._id,
    language: request.user.language as LanguageCode,
    ageGroup: 'preschool',
    owner: new mongoose.Types.ObjectId(owner),
    createdBy: new mongoose.Types.ObjectId(request.user.id),
    updatedBy: new mongoose.Types.ObjectId(request.user.id),
  });

  await User.updateOne(
    {_id: new mongoose.Types.ObjectId(owner)},
    {
      $set: {
        [`lastActiveGroups.${group.community._id.toJSON()}`]:
          group._id.toJSON(),
      },
    },
  );

  await group.populate([
    {
      path: 'owner',
      select: '_id firstName lastName avatar',
    },
  ]);

  if (!isDocument(group.owner)) {
    throw new Error('Owner is not populated');
  }

  response.status(201).json({
    ...group.toJSON(),
    owner: group.owner.toJSON(),
    articleProgress: group.articleProgress.map((p) => ({
      article: p.article._id.toString(),
      completionDate: p.completionDate.toJSON(),
    })),
  } satisfies CreateCommunityGroupResponse);
}
