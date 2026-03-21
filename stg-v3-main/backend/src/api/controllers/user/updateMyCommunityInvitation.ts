import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {CommunityMemberInvitation} from '../../../models/index.js';
import {type UpdateMyCommunityInvitationParameters} from '../../client/ApiTypes.js';

export async function updateMyCommunityInvitation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateMyCommunityInvitationParameters;

  const invitation = await CommunityMemberInvitation.findById(id).populate([
    {
      path: 'user',
    },
    {
      path: 'community',
    },
  ]);

  if (!invitation) {
    response.status(404).json({error: 'Invitation not found'});
    return;
  }

  const {user, community} = invitation;
  if (!isDocument(community)) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  if (!isDocument(user)) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  await community.upsertMemberAndSave(user._id, 'member');
  await invitation.deleteOne();

  response.sendStatus(204);
}
