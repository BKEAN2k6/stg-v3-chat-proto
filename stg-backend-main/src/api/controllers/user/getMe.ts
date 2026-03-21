import {type Request, type Response} from 'express';
import type mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {
  User,
  CommunityMembership,
  DailyActiveUsers,
  WeeklyActiveUsers,
  MonthlyActiveUsers,
} from '../../../models';
import {type GetMeResponse} from '../../client/ApiTypes';

export async function getMe(
  request: Request,
  response: Response,
): Promise<void> {
  const user = await User.findById(request.user.id);

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const communityMemberships = await CommunityMembership.find({
    user: user._id,
  }).populate([
    {
      path: 'community',
      select: '_id name avatar',
    },
  ]);

  if (communityMemberships.length === 0) {
    response.status(404).json({error: 'User has no community memberships'});
    return;
  }

  const memberCounts = await CommunityMembership.aggregate([
    {
      $match: {
        community: {$in: communityMemberships.map((cm) => cm.community._id)},
      },
    },
    {
      $group: {
        _id: '$community',
        count: {$sum: 1},
      },
    },
  ]);

  const communities = communityMemberships.map((communityMembership) => {
    if (!isDocument(communityMembership.community)) {
      throw new Error('Community is not a document');
    }

    const {community, role} = communityMembership;
    const {_id, name, avatar} = community;
    type MemberCount = {_id: mongoose.Types.ObjectId; count: number};
    const memberCount =
      (memberCounts as MemberCount[]).find((mc) => mc._id.equals(community._id))
        ?.count ?? 0;

    return {
      _id: _id.toHexString(),
      name,
      avatar,
      role,
      memberCount,
    };
  });

  if (!user.selectedCommunity) {
    user.selectedCommunity = communityMemberships[0].community._id;
    await user.save();
  } else if (
    !communityMemberships.some((cm) =>
      cm.community._id.equals(user.selectedCommunity!._id),
    )
  ) {
    user.selectedCommunity = communityMemberships[0].community._id;
    await user.save();
  }

  response.json({
    ...user.toJSON(),
    communities,
  } satisfies GetMeResponse);

  const trackingData = {
    app: 'stg-backend',
    user: user._id,
    community: user.selectedCommunity._id,
  };
  await Promise.all([
    DailyActiveUsers.addUser(trackingData),
    WeeklyActiveUsers.addUser(trackingData),
    MonthlyActiveUsers.addUser(trackingData),
  ]);
}
