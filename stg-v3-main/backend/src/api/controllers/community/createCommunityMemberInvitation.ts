import {type Request, type Response} from 'express';
import {
  User,
  Community,
  CommunityMemberInvitation,
  CommunityInvitationNotification,
  CommunityMembership,
} from '../../../models/index.js';
import {
  type CreateCommunityMemberInvitationParameters,
  type CreateCommunityMemberInvitationRequest,
  type CreateCommunityMemberInvitationResponse,
} from '../../client/ApiTypes.js';

export async function createCommunityMemberInvitation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommunityMemberInvitationParameters;
  const {email, message} =
    request.body as CreateCommunityMemberInvitationRequest;

  const user = await User.findOne({email});
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const existingMembership = await CommunityMembership.findOne({
    community,
    user,
  });
  if (existingMembership) {
    response
      .status(400)
      .json({error: 'User is already a member of this community'});
    return;
  }

  const invitation = await CommunityMemberInvitation.create({
    community,
    user,
    createdBy: request.user.id,
    message,
  });

  await CommunityInvitationNotification.create({
    actor: request.user.id,
    community,
    user,
  });

  response.status(201).json({
    id: invitation._id.toJSON(),
    email: user.email,
    createdAt: invitation.createdAt!.toISOString(),
  } satisfies CreateCommunityMemberInvitationResponse);
}
