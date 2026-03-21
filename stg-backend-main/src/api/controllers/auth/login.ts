import {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import argon2 from 'argon2';
import {Community, CommunityInvitation, User} from '../../../models';
import {type LoginRequest} from '../../client/ApiTypes';

const localAuthetication: RequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  (
    passport.authenticate(
      'local',
      async function (error: Error, user: Request['user']) {
        if (error) {
          next(error);
          return;
        }

        if (!user) {
          return response
            .status(401)
            .json({error: 'Invalid email or password'});
        }

        const {invitationCode: code} = request.body as LoginRequest;
        if (code) {
          const invitation = await CommunityInvitation.findOne({code});
          if (!invitation) {
            return response.status(404).json({error: 'Invitation not found'});
          }

          const community = await Community.findById(invitation.community);
          if (!community) {
            return response.status(404).json({error: 'Community not found'});
          }

          const userId = new mongoose.Types.ObjectId(user.id);
          const isMember = await community.isMember(userId);

          if (!isMember) {
            await community.upsertMemberAndSave(userId, 'member');
          }

          await User.updateOne(
            {_id: userId},
            {selectedCommunity: community._id},
          );
        }

        request.logIn(user, next);
      },
    ) as RequestHandler
  )(request, response, next);
};

export async function login(
  request: Request,
  response: Response,
): Promise<void> {
  const {email, password} = request.body as LoginRequest;

  const user = await User.findOne({email}).select('directusPassword');

  if (
    user?.directusPassword &&
    (await argon2.verify(user.directusPassword, password))
  ) {
    await user.setPassword(password);
    user.directusPassword = undefined;
    await user.save();
  }

  localAuthetication(request, response, async (error) => {
    if (error) {
      request.logger.log(error);
      throw new Error('Error logging in');
    }

    response.sendStatus(204);
  });
}
