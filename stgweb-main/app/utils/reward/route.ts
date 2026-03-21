// - takes in a reward slug, looks up user with auth token
// - looks up the reward table to see if the amount of credits that relate to this reward slug && how often it can be granted
// - looks up the user in the granted_reward table to see that the reward wasn't already granted (within time limit)
// - if all good, add amount of credits specified by the reward to the user record

import {type NextRequest} from 'next/server';
import {
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const authToken = request.cookies.get('auth_token')?.value ?? '';

  const userDirectus = await createServerSideDirectusClient({authToken});
  const adminDirectus = await createServerSideAdminDirectusClient();

  if (!body.rewardSlug) {
    return respond(400, 'invalid-input');
  }

  // fetch user by auth token

  let userWithRewards: any;
  try {
    userWithRewards = await userDirectus.users.me.read({
      fields: [
        'id',
        'credit_count',
        'granted_rewards.date_created',
        'granted_rewards.reward.slug',
      ],
      deep: {
        granted_rewards: {
          _limit: -1 as any,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-user');
  }

  if (!userWithRewards) {
    return respond(404, 'user-not-found');
  }

  // fetch reward by slug

  let reward: any;
  try {
    const rewardQuery = await adminDirectus.items('reward').readByQuery({
      filter: {
        slug: {_eq: body.rewardSlug},
      },
    });
    reward = rewardQuery?.data?.[0];
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-reward');
  }

  if (!reward) {
    return respond(404, 'reward-not-found');
  }

  // check if this reward can be granted
  const rewardGrantedToUser = userWithRewards.granted_rewards.filter(
    (grant: any) => grant.reward?.slug === reward.slug,
  );

  let canGrant = false;

  // If reward hasn't been granted to the user at all, it can be granted
  if (rewardGrantedToUser.length === 0) {
    canGrant = true;
  }

  if (!canGrant) {
    // Sort the rewards based on the date they were created and get the most recent one
    const mostRecentRewardDate = rewardGrantedToUser.sort(
      (a: any, b: any) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
    )[0].date_created;

    const currentDate = new Date();
    const lastGrantedDate = new Date(mostRecentRewardDate);

    switch (reward.grant_frequency) {
      case 'daily': {
        canGrant =
          currentDate.getDate() !== lastGrantedDate.getDate() ||
          currentDate.getMonth() !== lastGrantedDate.getMonth() ||
          currentDate.getFullYear() !== lastGrantedDate.getFullYear();
        break;
      }

      case 'weekly': {
        // NOTE: written by AI and not tested!!
        // Get day difference
        const daysDifference =
          (currentDate.getTime() - lastGrantedDate.getTime()) /
          (1000 * 3600 * 24);
        canGrant = daysDifference >= 7;
        break;
      }

      case 'monthly': {
        // NOTE: written by AI and not tested!!
        canGrant =
          currentDate.getMonth() !== lastGrantedDate.getMonth() ||
          currentDate.getFullYear() !== lastGrantedDate.getFullYear();
        break;
      }

      case 'yearly': {
        // NOTE: written by AI and not tested!!
        canGrant = currentDate.getFullYear() !== lastGrantedDate.getFullYear();
        break;
      }

      default:
    }
  }

  if (
    reward.times_granted !== -1 &&
    rewardGrantedToUser.length >= reward.times_granted
  ) {
    canGrant = false;
  }

  if (!canGrant) {
    return respond(400, 'reward-cannot-be-granted');
  }

  adminDirectus.items('granted_reward').createOne({
    user: userWithRewards.id,
    reward: reward.id,
  });

  // update users credit count
  const currentCreditCount =
    Number.parseFloat(userWithRewards.credit_count) || 0;
  const newCreditCount =
    currentCreditCount + Number.parseFloat(reward.credits_granted);
  adminDirectus.items('directus_users').updateOne(userWithRewards.id, {
    credit_count: newCreditCount,
  });

  return respond(200, 'ok');
}
