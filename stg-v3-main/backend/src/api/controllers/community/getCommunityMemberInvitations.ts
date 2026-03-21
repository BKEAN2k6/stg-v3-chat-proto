import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {CommunityMemberInvitation} from '../../../models/index.js';
import {
  type GetCommunityMemberInvitationsParameters,
  type GetCommunityMemberInvitationsResponse,
} from '../../client/ApiTypes.js';

export async function getCommunityMemberInvitations(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: community} =
    request.params as GetCommunityMemberInvitationsParameters;

  const invitations = await CommunityMemberInvitation.find({
    community,
  }).populate([
    {
      path: 'user',
      select: 'email',
    },
  ]);

  response.json(
    invitations.map((invitation) => {
      if (!isDocument(invitation.user)) {
        throw new Error('User not found');
      }

      return {
        id: invitation._id.toJSON(),
        email: invitation.user.email,
        createdAt: invitation.createdAt!.toISOString(),
      };
    }) satisfies GetCommunityMemberInvitationsResponse,
  );
}
