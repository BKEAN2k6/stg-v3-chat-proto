import {type SubscriptionStatus} from '@client/ApiTypes';

export const normalizeOptionalText = (value?: string) =>
  value && value.trim().length > 0 ? value : undefined;

export const subscriptionStatuses: SubscriptionStatus[] = [
  'free-trial',
  'active-online',
  'active-manual',
  'grace',
  'expired',
];

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  'free-trial': 'Free trial',
  'active-online': 'Active (online billing)',
  'active-manual': 'Active (manual billing)',
  grace: 'Grace period',
  expired: 'Expired',
};

export const formatSubscriptionStatus = (
  status?: SubscriptionStatus,
): string => (status ? subscriptionStatusLabels[status] : 'Not set');
