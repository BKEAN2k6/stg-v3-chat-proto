export const SubscriptionHistoryEntry = {
  type: 'object',
  properties: {
    statusValidUntil: {type: 'string'},
    status: {$ref: '#/definitions/SubscriptionStatus'},
    subscriptionEnds: {type: 'boolean'},
    updatedAt: {type: 'string'},
    updatedBy: {$ref: '#/definitions/UserInfo'},
  },
} as const;
