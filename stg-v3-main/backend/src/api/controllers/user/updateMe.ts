import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {OnboardingCompleted, User} from '../../../models/index.js';
import {
  type UpdateMeRequest,
  type UpdateMeResponse,
} from '../../client/ApiTypes.js';

export async function updateMe(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const user = await User.findById(request.user.id);
    if (!user) {
      response.status(404).json({error: 'User not found'});
      return;
    }

    const {
      selectedCommunity,
      firstName,
      lastName,
      language,
      password,
      newPassword,
      avatar,
      consents,
      hasSetConsents,
      introSlidesRead,
    } = request.body as UpdateMeRequest;
    if (selectedCommunity) {
      user.selectedCommunity = new mongoose.Types.ObjectId(selectedCommunity);
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (language) {
      user.language = language;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (newPassword) {
      if (password) {
        user.hasSetPasseord = true;
        await user.changePassword(password, newPassword);
      } else if (request.session.allowPasswordChangeUntil) {
        if (request.session.allowPasswordChangeUntil < Date.now()) {
          response.status(400).json({error: 'Password change time expired'});
          return;
        }

        user.hasSetPasseord = true;
        await user.setPassword(newPassword);
        request.session.allowPasswordChangeUntil = undefined;
      } else {
        response.status(400).json({error: 'Password change not allowed'});
        return;
      }
    }

    if (avatar === '' || avatar) {
      user.avatar = avatar;
    }

    if (consents) {
      user.consents = consents;
    }

    if (hasSetConsents) {
      user.hasSetConsents = hasSetConsents;
    }

    if (introSlidesRead) {
      if (!user.introSlidesRead && introSlidesRead) {
        await OnboardingCompleted.create({
          createdBy: user._id,
          community: user.selectedCommunity!,
        });
      }

      user.introSlidesRead = new Date(introSlidesRead);
    }

    await user.save();

    response.json({
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
      avatar: user.avatar,
      selectedCommunity: user.selectedCommunity!._id.toJSON(),
      consents: user.consents,
      hasSetConsents: user.hasSetConsents,
    } satisfies UpdateMeResponse);
  } catch (error) {
    request.error = error;

    if (error instanceof Error && error.name === 'IncorrectPasswordError') {
      response.status(400).json({error: 'Existing password did not match'});
      return;
    }

    throw error;
  }
}
