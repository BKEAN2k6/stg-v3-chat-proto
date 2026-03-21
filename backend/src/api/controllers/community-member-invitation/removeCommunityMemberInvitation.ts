import {type Request, type Response} from 'express';
import {
  CommunityMemberInvitation,
  CommunityInvitationNotification,
} from '../../../models/index.js';
import {type RemoveCommunityMemberInvitationParameters} from '../../client/ApiTypes.js';

export async function removeCommunityMemberInvitation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveCommunityMemberInvitationParameters;

  const invitation = await CommunityMemberInvitation.findById(id);
  if (!invitation) {
    response.status(404).json({error: 'Invitation not found'});
    return;
  }

  await invitation.deleteOne();
  await CommunityInvitationNotification.deleteOne({invitation: id});

  response.sendStatus(204);
}
