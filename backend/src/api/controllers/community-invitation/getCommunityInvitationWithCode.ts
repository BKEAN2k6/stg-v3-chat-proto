import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {CommunityInvitation} from '../../../models/index.js';
import {
  type GetCommunityInvitationWithCodeParameters,
  type GetCommunityInvitationWithCodeResponse,
} from '../../client/ApiTypes.js';

export async function getCommunityInvitationWithCode(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.params as GetCommunityInvitationWithCodeParameters;

  const invitation = await CommunityInvitation.findOne({
    code,
  }).populate([
    {
      path: 'community',
      select: '_id name avatar',
    },
  ]);

  if (!invitation) {
    response.status(404).json({error: 'Invitation not found'});
    return;
  }

  if (!isDocument(invitation.community)) {
    throw new Error('Community is not populated');
  }

  response.json(
    invitation.community.toJSON() satisfies GetCommunityInvitationWithCodeResponse,
  );
}
