import {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import {Community, CommunityInvitation, User} from '../../../models/index.js';
import {type LoginRequest} from '../../client/ApiTypes.js';

const localAuthetication: RequestHandler = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  await (
    passport.authenticate(
      'local',
      async function (error: Error, user: Request['user']) {
        if (error) {
          next(error);
          return;
        }

        if (!user) {
          next(new Error('Invalid email or password'));
          return;
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
  await localAuthetication(request, response, async (error) => {
    if (error) {
      request.error = error; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      response.status(401).json({error: 'Invalid email or password'});
      return;
    }

    const {invitationCode: code, rememberMe} = request.body as LoginRequest;
    if (code) {
      const invitation = await CommunityInvitation.findOne({code});
      if (!invitation) {
        return response.status(404).json({error: 'Invitation not found'});
      }

      const community = await Community.findById(invitation.community);
      if (!community) {
        return response.status(404).json({error: 'Community not found'});
      }

      const userId = new mongoose.Types.ObjectId(request.user.id);
      const isMember = await community.isMember(userId);

      if (!isMember) {
        await community.upsertMemberAndSave(userId, 'member');
      }

      await User.updateOne({_id: userId}, {selectedCommunity: community._id});
    }

    if (rememberMe) {
      request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      request.session.cookie.expires = false;
    }

    response.sendStatus(204);
  });
}
