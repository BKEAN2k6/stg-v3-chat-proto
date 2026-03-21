export const BillingGroup = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    notes: {type: 'string'},
    lastSubscriptionEnd: {type: 'string'},
    billingContact: {$ref: '#/definitions/BillingContact'},
    communities: {
      type: 'array',
      items: {$ref: '#/definitions/BillingGroupCommunity'},
    },
  },
  required: ['id', 'name', 'billingContact', 'communities'],
} as const;
