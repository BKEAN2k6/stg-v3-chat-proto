export const SubscriptionStatus = {
  type: 'string',
  enum: ['free-trial', 'active-online', 'active-manual', 'grace', 'expired'],
} as const;
