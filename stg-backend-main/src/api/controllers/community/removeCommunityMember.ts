import {type Request, type Response} from 'express';
import {Community, User} from '../../../models';
import {type RemoveCommunityMemberParameters} from '../../client/ApiTypes';

export async function removeCommunityMember(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, userId} = request.params as RemoveCommunityMemberParameters;

  const community = await Community.findById(id);
  const user = await User.findById(userId);

  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  await community.removeMemberAndSave(user._id);

  response.sendStatus(204);
}
