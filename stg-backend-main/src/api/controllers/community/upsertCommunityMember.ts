import {type Request, type Response} from 'express';
import {Community, User} from '../../../models';
import {
  type UpsertCommunityMemberParameters,
  type UpsertCommunityMemberRequest,
} from '../../client/ApiTypes';

export async function upsertCommunityMember(
  request: Request,
  response: Response,
): Promise<void> {
  const {id, userId} = request.params as UpsertCommunityMemberParameters;
  const {role} = request.body as UpsertCommunityMemberRequest;

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
