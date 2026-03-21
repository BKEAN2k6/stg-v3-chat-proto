import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  type UpdateBillingGroupSubscriptionParameters,
  type UpdateBillingGroupSubscriptionRequest,
  type UpdateBillingGroupSubscriptionResponse,
} from '../../client/ApiTypes.js';
import {BillingGroup, Community} from '../../../models/index.js';
import {serializeBillingGroup} from './serializeBillingGroup.js';

export async function updateBillingGroupSubscription(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} =
    request.params as unknown as UpdateBillingGroupSubscriptionParameters;
  const payload = request.body as UpdateBillingGroupSubscriptionRequest;

  const billingGroup = await BillingGroup.findById(id);

  if (!billingGroup) {
    response.status(404).json({error: 'Billing group not found'});
    return;
  }

  const validUntilDate = new Date(payload.statusValidUntil);

  if (Number.isNaN(validUntilDate.getTime())) {
    response.status(400).json({error: 'Invalid status valid until date'});
    return;
  }

  const communityFilter: Record<string, unknown> = {
    billingGroup: billingGroup._id,
  };

  if (payload.communityIds !== undefined) {
    communityFilter._id = {$in: payload.communityIds};
  }

  const communities = await Community.find(communityFilter);
  const updatedCommunityIds = await Promise.all(
    communities.map(async (community) => {
      if (community.subscription) {
        community.subscription.statusValidUntil = validUntilDate;
        if (payload.status) {
          community.subscription.status = payload.status;
        }
      } else {
        community.subscription = {
          statusValidUntil: validUntilDate,
          status: payload.status ?? 'free-trial',
          subscriptionEnds: false,
        };
      }

      community.subscription.updatedAt = new Date();
      community.subscription.updatedBy = new mongoose.Types.ObjectId(
        request.user.id,
      );

      await community.save();
      return community._id.toJSON();
    }),
  );

  billingGroup.lastSubscriptionEnd = validUntilDate;
  await billingGroup.save();

  const serialized = await serializeBillingGroup(billingGroup);

  response.json({
    billingGroup: serialized,
    updatedCommunityIds,
  } satisfies UpdateBillingGroupSubscriptionResponse);
}
