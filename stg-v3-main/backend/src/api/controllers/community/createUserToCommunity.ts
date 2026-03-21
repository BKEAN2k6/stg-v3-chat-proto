import {type Request, type Response} from 'express';
import {sendWelcomeToCreatedUser} from '../auth/magic-login/index.js';
import {User, Community} from '../../../models/index.js';
import {
  type CreateUserToCommunityRequest,
  type CreateUserToCommunityParameters,
} from '../../client/ApiTypes.js';

export async function createUserToCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: communityId} = request.params as CreateUserToCommunityParameters;

  const {
    email,
    firstName,
    lastName,
    role,
    language,
    country,
    organization,
    organizationType,
    organizationRole,
  } = request.body as CreateUserToCommunityRequest;

  if (await User.exists({email})) {
    response
      .status(400)
      .json({error: 'User with a given email already exists'});
    return;
  }

  const community = await Community.findById(communityId);
  if (!community) {
    throw new Error(`Community with id ${communityId} does not exist`);
  }

  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new Error(`User with email ${email} already exists`);
  }

  const user = await User.create({
    email,
    firstName,
    lastName,
    language,
    country,
    organization,
    organizationType,
    organizationRole,
    selectedCommunity: community,
    registrationType: 'super-admin-created',
  });

  await community.upsertMemberAndSave(user._id, role);

  user.selectedCommunity = community;
  await user.save();
  await request.retentionStats.recordUserRegistered(
    user.sequenceNumber,
    user.createdAt!,
  );

  await sendWelcomeToCreatedUser({
    email,
    firstName,
    communityName: community.name,
  });

  response.sendStatus(204);
}
