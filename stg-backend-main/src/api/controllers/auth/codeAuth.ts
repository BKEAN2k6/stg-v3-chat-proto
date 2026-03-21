import {type Request, type Response, type RequestHandler} from 'express';
import passport from 'passport';
import {Community, CommunityInvitation, User} from '../../../models';
import {type CodeAuthRequest} from '../../client/ApiTypes';

const localAuthetication: RequestHandler = passport.authenticate(
  'local',
) as RequestHandler;

export async function codeAuth(
  request: Request,
  response: Response,
): Promise<void> {
  const {email, password, firstName, lastName, invitationCode, language} =
    request.body as CodeAuthRequest;

  const invitation = await CommunityInvitation.findOne({
    code: invitationCode,
  });
  if (!invitation) {
    response.status(401).json({error: 'Invalid invitation code'});
    return;
  }

  const community = await Community.findById(invitation.community);
  if (!community) {
    response.status(401).json({error: 'Invalid community'});
    return;
  }

  try {
    const user = await User.register(
      {
        firstName,
        lastName,
        email,
        language,
      },
      password,
    );

    await community.upsertMemberAndSave(user._id, 'member');

    user.selectedCommunity = community;
    await user.save();
  } catch (error) {
    const errorName = (error as Error).name;
    if (errorName === 'UserExistsError') {
      response.status(400).json({error: 'User with this email already exists'});
      return;
    }

    throw error;
  }

  localAuthetication(request, response, () => {
    response.sendStatus(204);
  });
}
