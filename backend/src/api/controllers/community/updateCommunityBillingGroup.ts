import {type Request, type Response} from 'express';
import {
  type UpdateCommunityBillingGroupParameters,
  type UpdateCommunityBillingGroupRequest,
  type UpdateCommunityBillingGroupResponse,
} from '../../client/ApiTypes.js';
import {BillingGroup, Community} from '../../../models/index.js';
import {serializeCommunity} from './serializeCommunity.js';

export async function updateCommunityBillingGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} =
    request.params as unknown as UpdateCommunityBillingGroupParameters;
  const payload = request.body as UpdateCommunityBillingGroupRequest;

  const community = await Community.findById(id);

  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  if (payload.billingGroupId) {
    const billingGroup = await BillingGroup.findById(payload.billingGroupId);

    if (!billingGroup) {
      response.status(404).json({error: 'Billing group not found'});
      return;
    }

    community.billingGroup = billingGroup._id;
  } else {
    community.billingGroup = undefined;
  }

  await community.save();

  response.json(
    serializeCommunity(community) satisfies UpdateCommunityBillingGroupResponse,
  );
}
