import {type DocumentType, isDocument} from '@typegoose/typegoose';
import {
  BillingGroup as BillingGroupModel,
  Community,
} from '../../../models/index.js';
import {type BillingGroup as BillingGroupClass} from '../../../models/BillingGroup.js';
import {type BillingContact as BillingContactClass} from '../../../models/BillingContact.js';
import {type BillingGroup as BillingGroupResponse} from '../../client/ApiTypes.js';

type BillingGroupDocument = DocumentType<BillingGroupClass>;
type BillingContactDocument = DocumentType<BillingContactClass>;

function mapStatusValidUntil(date?: Date): string | undefined {
  return date ? date.toISOString() : undefined;
}

export async function serializeBillingGroups(
  groups: BillingGroupDocument[],
): Promise<BillingGroupResponse[]> {
  if (groups.length === 0) {
    return [];
  }

  await BillingGroupModel.populate(groups, {path: 'billingContact'});
  const groupIds = groups.map((group) => group._id);

  const communities = await Community.find({
    billingGroup: {$in: groupIds},
  })
    .select(['name', 'timezone', 'subscription', 'billingGroup'])
    .sort('name')
    .populate({
      path: 'subscription.updatedBy',
      select: '_id firstName lastName avatar',
    });

  const communitiesByGroup = new Map<
    string,
    BillingGroupResponse['communities']
  >();

  for (const community of communities) {
    if (!community.billingGroup) continue;
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const groupId = community.billingGroup.toString();
    const entry =
      communitiesByGroup.get(groupId) ??
      ([] as BillingGroupResponse['communities']);
    entry.push({
      id: community._id.toJSON(),
      name: community.name,
      timezone: community.timezone,
      subscriptionStatusValidUntil: mapStatusValidUntil(
        community.subscription?.statusValidUntil,
      ),
      subscriptionStatus: community.subscription?.status,
      subscriptionUpdatedAt: community.subscription?.updatedAt?.toISOString(),
      subscriptionUpdatedBy: isDocument(community.subscription?.updatedBy)
        ? community.subscription.updatedBy.toJSON()
        : undefined,
    });
    communitiesByGroup.set(groupId, entry);
  }

  return groups.map((group) => {
    const billingContactDocument =
      group.billingContact as BillingContactDocument;
    return {
      id: group._id.toJSON(),
      name: group.name,
      notes: group.notes,
      lastSubscriptionEnd: group.lastSubscriptionEnd?.toISOString(),
      billingContact: billingContactDocument.toJSON(),
      communities: communitiesByGroup.get(group._id.toJSON()) ?? [],
    };
  });
}

export async function serializeBillingGroup(
  group: BillingGroupDocument,
): Promise<BillingGroupResponse> {
  const [serialized] = await serializeBillingGroups([group]);
  return (
    serialized ?? {
      id: group._id.toJSON(),
      name: group.name,
      notes: group.notes,
      lastSubscriptionEnd: group.lastSubscriptionEnd?.toISOString(),
      billingContact: (group.billingContact as BillingContactDocument).toJSON(),
      communities: [],
    }
  );
}
