import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  User,
  DailyActiveUsers,
  WeeklyActiveUsers,
  MonthlyActiveUsers,
} from '../../../models';
import {
  type UpdateMeRequest,
  type UpdateMeResponse,
} from '../../client/ApiTypes';

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
        await user.changePassword(password, newPassword);
      } else if (request.session.allowPasswordChangeUntil) {
        if (request.session.allowPasswordChangeUntil < Date.now()) {
          response.status(400).json({error: 'Password change time expired'});
          return;
        }

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

    const wasCommunityModified = user.isModified('selectedCommunity');

    await user.save();

    response.json({
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
      avatar: user.avatar,
      selectedCommunity: user.selectedCommunity!._id.toHexString(),
    } satisfies UpdateMeResponse);

    if (wasCommunityModified) {
      const trackingData = {
        app: 'stg-backend',
        user: user._id,
        community: user.selectedCommunity!._id,
      };
      await Promise.all([
        DailyActiveUsers.addUser(trackingData),
        WeeklyActiveUsers.addUser(trackingData),
        MonthlyActiveUsers.addUser(trackingData),
      ]);
    }
  } catch (error) {
    request.logger.log(error);

    if (error instanceof Error && error.name === 'IncorrectPasswordError') {
      response.status(400).json({error: 'Existing password did not match'});
      return;
    }

    throw error;
  }
}
