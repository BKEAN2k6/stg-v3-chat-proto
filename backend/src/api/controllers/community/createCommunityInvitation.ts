import {type Request, type Response} from 'express';
import {Community, CommunityInvitation} from '../../../models/index.js';
import {
  type CreateCommunityInvitationParameters,
  type CreateCommunityInvitationResponse,
} from '../../client/ApiTypes.js';

export async function createCommunityInvitation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommunityInvitationParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const invitation = await CommunityInvitation.create({
    community: community._id,
  });

  response.status(201).json({
    ...invitation.toJSON(),
    createdAt: invitation.createdAt.toJSON(),
  } satisfies CreateCommunityInvitationResponse);
}
