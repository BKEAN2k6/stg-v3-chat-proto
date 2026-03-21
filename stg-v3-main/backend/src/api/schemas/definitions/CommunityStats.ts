export const CommunityStats = {
  type: 'object',
  properties: {
    topStrengths: {
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
    leaderboard: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          avatar: {
            type: 'string',
          },
          count: {type: 'number'},
        },
        required: ['id', 'firstName', 'lastName', 'avatar', 'count'],
      },
    },
  },
  required: ['topStrengths', 'leaderboard'],
} as const;
