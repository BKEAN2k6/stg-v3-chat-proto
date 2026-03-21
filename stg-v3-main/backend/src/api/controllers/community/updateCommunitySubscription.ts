import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  type UpdateCommunitySubscriptionParameters,
  type UpdateCommunitySubscriptionRequest,
  type GetCommunitySubscriptionResponse,
  type UserInfo,
} from '../../client/ApiTypes.js';
import {Community} from '../../../models/index.js';
import {type User as UserClass} from '../../../models/User.js';

export async function updateCommunitySubscription(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} =
    request.params as unknown as UpdateCommunitySubscriptionParameters;
  const {statusValidUntil, status, subscriptionEnds} =
    request.body as UpdateCommunitySubscriptionRequest;

  const validUntilDate = new Date(statusValidUntil);
  if (!statusValidUntil || Number.isNaN(validUntilDate.getTime())) {
    response.status(400).json({error: 'Invalid status valid until date'});
    return;
  }

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  if (community.subscription) {
    community.subscription.statusValidUntil = validUntilDate;
    if (status) {
      community.subscription.status = status;
    }

    if (subscriptionEnds !== undefined) {
      community.subscription.subscriptionEnds = subscriptionEnds;
    }
  } else {
    community.subscription = {
      statusValidUntil: validUntilDate,
      status: status ?? 'free-trial',
      subscriptionEnds: subscriptionEnds ?? false,
    };
  }

  community.subscription.updatedAt = new Date();
  community.subscription.updatedBy = new mongoose.Types.ObjectId(
    request.user.id,
  );

  await community.save();
  await community.populate([
    {
      path: 'subscription.updatedBy',
      select: '_id firstName lastName avatar',
    },
    {
      path: 'subscriptionHistory.updatedBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  const serializeUser = (user: unknown): UserInfo | undefined => {
    if (!user) return undefined;
    if (user instanceof mongoose.Types.ObjectId) return undefined;
    const candidate = user as UserClass & {_id?: mongoose.Types.ObjectId};
    if (!candidate._id) return undefined;
    return {
      id: candidate._id.toJSON(),
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      avatar: candidate.avatar,
    };
  };

  const updatedBy = community.subscription?.updatedBy;
  const serializedUpdatedBy = serializeUser(updatedBy);

  const history =
    community.subscriptionHistory?.map((entry) => ({
      statusValidUntil: entry.statusValidUntil?.toJSON(),
      status: entry.status,
      subscriptionEnds: entry.subscriptionEnds,
      updatedAt: entry.updatedAt?.toJSON(),
      updatedBy: serializeUser(entry.updatedBy),
    })) ?? [];

  const statusValidUntilResponse =
    community.subscription.statusValidUntil?.toJSON();

  response.json({
    statusValidUntil: statusValidUntilResponse,
    status: community.subscription.status,
    subscriptionEnds: community.subscription.subscriptionEnds,
    updatedAt: community.subscription.updatedAt?.toJSON(),
    updatedBy: serializedUpdatedBy,
    history,
  } satisfies GetCommunitySubscriptionResponse);
}
