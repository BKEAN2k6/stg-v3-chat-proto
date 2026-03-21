export const Community = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    description: {type: 'string'},
    language: {$ref: '#/definitions/LanguageCode'},
    avatar: {type: 'string'},
    timezone: {type: 'string'},
    billingGroup: {type: 'string'},
    subscriptionStatusValidUntil: {type: 'string'},
    subscriptionStatus: {$ref: '#/definitions/SubscriptionStatus'},
    subscriptionEnds: {type: 'boolean'},
  },
  required: ['id', 'name', 'description', 'language', 'timezone'],
} as const;
