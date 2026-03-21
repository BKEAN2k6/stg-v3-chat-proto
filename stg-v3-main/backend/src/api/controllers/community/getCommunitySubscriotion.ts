import {type Request, type Response} from 'express';
import type {Types} from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {
  type GetCommunitySubscriptionParameters,
  type GetCommunitySubscriptionResponse,
  type UserInfo,
} from '../../client/ApiTypes.js';
import {Community} from '../../../models/index.js';
import {type User as UserClass} from '../../../models/User.js';

export async function getCommunitySubscription(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunitySubscriptionParameters;
  const community = await Community.findById(id)
    .select(['subscription', 'subscriptionHistory'])
    .populate([
      {
        path: 'subscription.updatedBy',
        select: '_id firstName lastName avatar',
      },
      {
        path: 'subscriptionHistory.updatedBy',
        select: '_id firstName lastName avatar',
      },
    ]);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const updatedBy = community.subscription?.updatedBy;
  let serializedUpdatedBy: UserInfo | undefined;
  if (isDocument<UserClass, Types.ObjectId>(updatedBy)) {
    serializedUpdatedBy = {
      id: updatedBy._id.toJSON(),
      firstName: updatedBy.firstName,
      lastName: updatedBy.lastName,
      avatar: updatedBy.avatar,
    };
  }

  const history =
    community.subscriptionHistory?.map((historyEntry) => {
      const historyUpdatedBy = historyEntry.updatedBy;
      let serializedHistoryUpdatedBy: UserInfo | undefined;
      if (isDocument<UserClass, Types.ObjectId>(historyUpdatedBy)) {
        serializedHistoryUpdatedBy = {
          id: historyUpdatedBy._id.toJSON(),
          firstName: historyUpdatedBy.firstName,
          lastName: historyUpdatedBy.lastName,
          avatar: historyUpdatedBy.avatar,
        };
      }

      const entryStatusValidUntil = historyEntry.statusValidUntil?.toJSON();

      return {
        statusValidUntil: entryStatusValidUntil,
        status: historyEntry.status,
        subscriptionEnds: historyEntry.subscriptionEnds,
        updatedAt: historyEntry.updatedAt?.toJSON(),
        updatedBy: serializedHistoryUpdatedBy,
      };
    }) ?? [];

  const statusValidUntil = community.subscription?.statusValidUntil?.toJSON();
  response.json({
    statusValidUntil,
    status: community.subscription?.status,
    subscriptionEnds: community.subscription?.subscriptionEnds,
    updatedAt: community.subscription?.updatedAt?.toJSON(),
    updatedBy: serializedUpdatedBy,
    history,
  } satisfies GetCommunitySubscriptionResponse);
}
