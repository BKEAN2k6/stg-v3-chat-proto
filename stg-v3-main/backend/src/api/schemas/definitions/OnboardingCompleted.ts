export const OnboardingCompleted = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    comments: {
      type: 'array',
      items: {$ref: '#/definitions/Comment'},
    },
    reactions: {
      type: 'array',
      items: {$ref: '#/definitions/Reaction'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    postType: {type: 'string', enum: ['onboarding-completed']},
  },
  required: [
    'id',
    'createdBy',
    'comments',
    'reactions',
    'createdAt',
    'updatedAt',
    'postType',
  ],
} as const;
