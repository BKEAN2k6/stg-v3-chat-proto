import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {type GetMyCommunityInvitationsResponse} from '../../client/ApiTypes.js';
import {CommunityMemberInvitation} from '../../../models/index.js';

export async function getMyCommunityInvitations(
  request: Request,
  response: Response,
): Promise<void> {
  const invitations = await CommunityMemberInvitation.find({
    user: request.user.id,
  }).populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },

    {
      path: 'community',
      select: '_id name',
    },
  ]);

  response.json(
    invitations.map((invitation) => {
      if (
        !isDocument(invitation.createdBy) ||
        !isDocument(invitation.community)
      ) {
        throw new Error('Invalid invitation');
      }

      return {
        ...invitation.toJSON(),
        createdBy: {
          ...invitation.createdBy.toJSON(),
        },
        community: {
          ...invitation.community.toJSON(),
        },
      };
    }) satisfies GetMyCommunityInvitationsResponse,
  );
}
