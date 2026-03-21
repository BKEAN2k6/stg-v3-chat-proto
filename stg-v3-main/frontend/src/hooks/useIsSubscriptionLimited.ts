import {useCurrentUser} from '@/context/currentUserContext.js';

export function useIsSubscriptionLimited(): boolean {
  const {currentUser} = useCurrentUser();
  const selectedCommunity = currentUser?.communities.find(
    (c) => c.id === currentUser.selectedCommunity,
  );
  const status = selectedCommunity?.subscriptionStatus;
  return !status || status === 'expired' || status === 'free-trial';
}
