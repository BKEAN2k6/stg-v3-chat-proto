export const StrengthCompleted = {
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
    postType: {type: 'string', enum: ['strength-completed']},
    strength: {$ref: '#/definitions/StrengthSlug'},
    group: {$ref: '#/definitions/Group'},
  },
  required: [
    'id',
    'createdBy',
    'comments',
    'reactions',
    'createdAt',
    'updatedAt',
    'postType',
    'strength',
    'group',
  ],
} as const;
