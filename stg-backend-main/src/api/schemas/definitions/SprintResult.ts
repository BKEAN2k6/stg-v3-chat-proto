// This is a placesholder for the challenge schema that is not yet in use
export const SprintResult = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
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
    '_id',
    'createdBy',
    'comments',
    'reactions',
    'createdAt',
    'updatedAt',
    'postType',
    'strengths',
  ],
} as const;
