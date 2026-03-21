import {type Request, type Response} from 'express';
import {type GetUserRetentionResponse} from '../../client/ApiTypes.js';
import {User} from '../../../models/index.js';

const unknownUser = {
  id: 'unknown',
  firstName: 'Unknown',
  lastName: 'User',
  email: 'unknown@example.com',
  organization: 'unknown',
  country: 'unknown',
};

export async function getUserRetention(
  request: Request,
  response: Response,
): Promise<void> {
  const allUsers = await request.retentionStats.getAllUsersRetention();
  const existingUsers =
    await request.retentionStats.getExistingUsersRetention();
  const registeredUsers =
    await request.retentionStats.getRegisteredUsersRetention();

  const topUsers = await request.retentionStats.getTopUsers();

  const topUserIds = new Set<number>();
  for (const period of ['daily', 'weekly', 'monthly'] as const) {
    for (const user of topUsers[period]) {
      topUserIds.add(user.userId);
    }
  }

  const usersIdArray = [...topUserIds];

  const users = await User.find({
    sequenceNumber: {$in: usersIdArray},
  }).select('firstName lastName email sequenceNumber organization country');

  const usersWithData = {
    daily: topUsers.daily
      .sort((a, b) => b.visitCount - a.visitCount)
      .map((topUser) => {
        const user =
          users.find((u) => u.sequenceNumber === topUser.userId)?.toJSON() ??
          unknownUser;
        return {
          ...user,
          visitCount: topUser.visitCount,
        };
      }),
    weekly: topUsers.weekly
      .sort((a, b) => b.visitCount - a.visitCount)
      .map((topUser) => {
        const user =
          users.find((u) => u.sequenceNumber === topUser.userId)?.toJSON() ??
          unknownUser;
        return {
          ...user,
          visitCount: topUser.visitCount,
        };
      }),
    monthly: topUsers.monthly
      .sort((a, b) => b.visitCount - a.visitCount)
      .map((topUser) => {
        const user =
          users.find((u) => u.sequenceNumber === topUser.userId)?.toJSON() ??
          unknownUser;
        return {
          ...user,
          visitCount: topUser.visitCount,
        };
      }),
  };

  const newUsers = await User.find()
    .sort({createdAt: -1})
    .limit(100)
    .select('firstName lastName email organization createdAt country');

  response.json({
    allUsers,
    existingUsers,
    registeredUsers,
    topUsers: usersWithData,
    newUsers: newUsers.map((user) => ({
      ...user.toJSON(),
      id: user._id.toJSON(),
      createdAt: user.createdAt!.toJSON(),
    })),
  } satisfies GetUserRetentionResponse);
}
