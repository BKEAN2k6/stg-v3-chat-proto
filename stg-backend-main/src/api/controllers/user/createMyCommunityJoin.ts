import {type Request, type Response} from 'express';
import {Community, CommunityInvitation, User} from '../../../models';
import {type CreateMyCommunityJoinRequest} from '../../client/ApiTypes';

export async function createMyCommunityJoin(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.body as CreateMyCommunityJoinRequest;

  const invitation = await CommunityInvitation.findOne({
    code,
  });
  if (!invitation) {
    response.status(401).json({error: 'Invitioan not found'});
    return;
  }

  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const community = await Community.findById(invitation.community);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  await community.upsertMemberAndSave(user._id, 'member');

  user.selectedCommunity = community._id;
  await user.save();

  response.sendStatus(204);
}
