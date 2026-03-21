export const BillingGroupCommunity = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    timezone: {type: 'string'},
    subscriptionStatusValidUntil: {type: 'string'},
    subscriptionStatus: {$ref: '#/definitions/SubscriptionStatus'},
    subscriptionUpdatedAt: {type: 'string'},
    subscriptionUpdatedBy: {$ref: '#/definitions/UserInfo'},
  },
  required: ['id', 'name', 'timezone'],
} as const;
