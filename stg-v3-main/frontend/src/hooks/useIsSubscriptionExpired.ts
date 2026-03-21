import {useCurrentUser} from '@/context/currentUserContext.js';

export function useIsSubscriptionExpired(): boolean {
  const {currentUser} = useCurrentUser();
  const selectedCommunity = currentUser?.communities.find(
    (c) => c.id === currentUser.selectedCommunity,
  );
  return selectedCommunity?.subscriptionStatus === 'expired';
}
