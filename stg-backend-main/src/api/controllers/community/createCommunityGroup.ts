import {type Request, type Response} from 'express';
import {Community, Group} from '../../../models';
import {
  type CreateCommunityGroupRequest,
  type CreateCommunityGroupResponse,
  type CreateCommunityGroupParameters,
} from '../../client/ApiTypes';

export async function createCommunityGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, description} = request.body as CreateCommunityGroupRequest;
  const {id} = request.params as CreateCommunityGroupParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const group = await Group.create({
    name,
    description,
    community: community._id,
  });

  community.groups.push(group._id);
  await community.save();

  response
    .status(201)
    .json(group.toJSON() satisfies CreateCommunityGroupResponse);
}
