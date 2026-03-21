import mongoose from 'mongoose';
import {type DocumentType, type Ref} from '@typegoose/typegoose';
import {type Community as CommunityModel} from '../../../models/Community.js';
import {type BillingGroup} from '../../../models/BillingGroup.js';
import {type Community as CommunityResponse} from '../../client/ApiTypes.js';

type CommunityDocument = DocumentType<CommunityModel>;
type CommunityJson = Omit<
  CommunityResponse,
  'billingGroup' | 'subscriptionStatusValidUntil' | 'subscriptionStatus'
> & {
  billingGroup?: Ref<BillingGroup>;
  subscription?: {
    statusValidUntil?: Date;
    status?: CommunityResponse['subscriptionStatus'];
  };
};

export function serializeCommunity(
  community: CommunityDocument,
): CommunityResponse {
  const json = community.toJSON() as CommunityJson;
  const subscriptionStatusValidUntil =
    json.subscription?.statusValidUntil?.toJSON();
  const subscriptionStatus = json.subscription?.status;
  const billingGroup =
    typeof json.billingGroup === 'string'
      ? json.billingGroup
      : json.billingGroup instanceof mongoose.Types.ObjectId
        ? json.billingGroup.toJSON()
        : undefined;

  return {
    ...json,
    billingGroup,
    subscriptionStatusValidUntil,
    subscriptionStatus,
  };
}

export function serializeCommunities(
  communities: CommunityDocument[],
): CommunityResponse[] {
  return communities.map((community) => serializeCommunity(community));
}
