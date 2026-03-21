export const SprintResult = {
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
    postType: {type: 'string', enum: ['sprint-result']},
    groupName: {type: 'string'},
    strengths: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
          count: {type: 'number'},
        },
        required: ['strength', 'count'],
      },
    },
  },
  required: [
    'id',
    'createdBy',
    'comments',
    'reactions',
    'createdAt',
    'updatedAt',
    'postType',
    'groupName',
    'strengths',
  ],
} as const;
