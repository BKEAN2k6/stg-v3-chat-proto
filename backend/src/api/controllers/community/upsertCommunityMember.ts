import {type Request, type Response} from 'express';
import {Community, User, CommunityMembership} from '../../../models/index.js';
import {
  type UpsertCommunityMemberParameters,
  type UpsertCommunityMemberRequest,
} from '../../client/ApiTypes.js';

export async function upsertCommunityMember(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, userId} = request.params as UpsertCommunityMemberParameters;
  const {role} = request.body as UpsertCommunityMemberRequest;

  const communityMembership = await CommunityMembership.findOne({
    community: id,
    user: userId,
  });

  if (!communityMembership && !request.user.roles.includes('super-admin')) {
    response.status(400).json({error: 'User is not a member of the community'});
    return;
  }

  if (
    (role === 'owner' || communityMembership?.role === 'owner') &&
    !request.user.roles.includes('super-admin')
  ) {
    response.status(400).json({error: 'Cannot change owner role'});
    return;
  }

  if (role === communityMembership?.role) {
    response.sendStatus(204);
    return;
  }

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  await community.upsertMemberAndSave(user._id, role);

  response.sendStatus(204);
}
