export const StrengthPeriod = {
  type: 'object',
  properties: {
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          start: {
            type: 'string',
          },
          articleId: {type: 'string'},
          rootCategoryId: {type: 'string'},
        },
        required: ['_id', 'start', 'articleId', 'rootCategoryId'],
      },
    },
    strength: {$ref: '#/definitions/StrengthSlug'},
    _id: {
      type: 'string',
    },
  },
  required: ['timeline', 'strength', '_id'],
} as const;
