import {type Request, type Response} from 'express';
import {
  type LanguageCode,
  type MagicLoginRequest,
  type MagicLoginResponse,
} from '../../client/ApiTypes.js';
import {User, Community} from '../../../models/index.js';
import {
  toGenitiveCommunityName,
  toGenitiveCommunitDescription,
} from '../toGenitive.js';
import {decodeToken} from './magic-login/index.js';
import createOrUpdateContact from './magic-login/emails/createOrUpdateContact.js';

export async function magicLogin(
  request: Request,
  response: Response,
): Promise<void> {
  const {token} = request.body as MagicLoginRequest;

  const {
    email,
    firstName,
    lastName,
    country,
    organization,
    organizationType,
    organizationRole,
    language,
    resetPassword,
  } = decodeToken(token) as {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    language: LanguageCode;
    country: string;
    organization: string;
    organizationType: string;
    organizationRole: string;
    resetPassword: boolean;
  };

  let user = await User.findOne({email});
  if (!user) {
    if (
      !firstName ||
      !lastName ||
      !language ||
      !country ||
      !organization ||
      !organizationType ||
      !organizationRole
    ) {
      response.status(400).json({error: 'Invalid token'});
      return;
    }

    user = new User({
      email,
      firstName,
      lastName,
      language,
      country,
      organization,
      organizationType,
      organizationRole,
    });
  }

  user.isEmailVerified = true;

  if (resetPassword) {
    user.allowPasswordChange = true;
  }

  const isNewUser = user.isNew;

  await user.save();

  if (isNewUser) {
    const community = await Community.create({
      name: toGenitiveCommunityName(language, firstName),
      description: toGenitiveCommunitDescription(language, firstName, lastName),
      language,
    });

    await community.upsertMemberAndSave(user._id, 'owner');
    user.selectedCommunity = community;

    await user.save();

    await request.retentionStats.recordUserRegistered(
      user.sequenceNumber,
      user.createdAt!,
    );

    try {
      await createOrUpdateContact({
        ...user.toJSON(),
        id: user.sequenceNumber.toString(),
        createdAt: user.createdAt!,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not create or update contact:', error);
    }
  }

  request.logIn(user, (error) => {
    if (error) {
      request.error = error as Error;
      response.status(401).json({error: 'Could not log in'});
      return;
    }

    if (resetPassword) {
      request.session.allowPasswordChangeUntil = Date.now() + 1000 * 60 * 15;
    }

    response.status(201).json({
      allowPasswordChange: Boolean(user.allowPasswordChange),
      forcePasswordChange: Boolean(!user.hasSetPasseord),
    } satisfies MagicLoginResponse);
  });
}
