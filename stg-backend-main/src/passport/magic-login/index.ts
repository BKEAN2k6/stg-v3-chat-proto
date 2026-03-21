import process from 'node:process';
import {
  User,
  Community,
  CommunityInvitation,
  CommunityMembership,
} from '../../models';
import MagicLoginStrategy from './strategy';
import sendResetPasswordEmail from './emails/sendResetPassword';
import sendSingleSignOnEmail from './emails/sendSingleSignOn';
import sendWelcomeToCreatedUserEmail from './emails/sendWelcomeCreatedUser';
import sendWelcomeToNewUserEmail from './emails/sendWelcomeNewUser';

const magicLogin = new MagicLoginStrategy({
  secret: process.env.MAGIC_LINK_SECRET,
  callbackUrl: '/auth-callback',
  confirmNewEmaiCallbacklUrl: '/confirm-email',
  async sendMagicLink(destination, href, code, request) {
    const {
      resetPassword,
      isRegistration,
      communityId,
      firstName,
      lastName,
      role,
      language,
    } = request.body as {
      firstName: string;
      lastName: string;
      resetPassword: boolean;
      isRegistration: boolean;
      communityId: string;
      language: string;
      role: 'member' | 'admin';
    };

    const user = await User.findOne({email: destination});

    if (!communityId && !isRegistration && !user) {
      request.logger.log(
        `Magic link request for non-existing user ${destination}`,
      );
      return;
    }

    if (communityId) {
      const community = await Community.findById(communityId);
      if (!community) {
        throw new Error(`Community with id ${communityId} does not exist`);
      }

      const existingUser = await User.findOne({email: destination});
      if (existingUser) {
        throw new Error(`User with email ${destination} already exists`);
      }

      const user = await User.create({
        email: destination,
        firstName,
        lastName,
        language,
        selectedCommunity: community,
      });

      await community.upsertMemberAndSave(user._id, role);

      user.selectedCommunity = community;
      await user.save();

      await sendWelcomeToCreatedUserEmail(
        firstName,
        destination,
        community.name,
        href,
      );
    } else if (isRegistration) {
      await sendWelcomeToNewUserEmail(firstName, destination, href);
    } else if (resetPassword && user) {
      await sendResetPasswordEmail(user.firstName, destination, href);
    } else if (user) {
      await sendSingleSignOnEmail(user.firstName, destination, href);
    }
  },
  async verify(data, callback) {
    const {
      destination,
      invitationCode,
      firstName,
      lastName,
      language,
      resetPassword,
    } = data as {
      destination: string;
      invitationCode: string;
      firstName: string;
      lastName: string;
      language: string;
      resetPassword: boolean;
    };

    try {
      if (!destination) {
        callback(new Error('Missing destination'));
        return;
      }

      let user = await User.findOne({email: destination});
      if (!user) {
        if (!firstName || !lastName) {
          callback(new Error('Missing first name or last name'));
          return;
        }

        user = new User({email: destination, firstName, lastName, language});
      }

      const isNewUser = user.isNew;

      if (resetPassword) {
        user.allowPasswordChange = true;
      }

      if (!isNewUser) {
        callback(undefined, user);
        return;
      }

      if (invitationCode) {
        const invitation = await CommunityInvitation.findOne({
          code: invitationCode,
        });
        if (!invitation) {
          callback(new Error('Invalid code'));
          return;
        }

        const community = await Community.findById(invitation.community);
        if (!community) {
          callback(new Error('Invalid community'));
          return;
        }

        const membership = await CommunityMembership.findOne({
          community: community._id,
          member: user._id,
        });

        if (membership) {
          callback(new Error('User is already a member of this community'));
          return;
        }

        await community.upsertMemberAndSave(user._id, 'member');

        user.selectedCommunity = community;
      } else {
        const community = await Community.create({
          name: `${user.firstName}´s community`,
          description: 'This is your community.',
          language,
          groups: [],
        });

        await community.upsertMemberAndSave(user._id, 'admin');

        user.selectedCommunity = community;
      }

      user.isEmailVerified = true;

      await user.save();
      callback(undefined, user);
    } catch {
      callback(new Error('Could not verify user'));
    }
  },

  jwtOptions: {
    expiresIn: 60 * 15, // 15 minutes
  },
});

export default magicLogin;
