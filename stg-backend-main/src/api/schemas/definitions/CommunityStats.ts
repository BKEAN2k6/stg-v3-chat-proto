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
          _id: {
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
        required: ['_id', 'firstName', 'lastName', 'avatar', 'count'],
      },
    },
    moodMeter: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          mood: {type: 'number'},
          count: {type: 'number'},
        },
        required: ['mood', 'count'],
      },
    },
  },
  required: ['topStrengths', 'leaderboard', 'moodMeter'],
} as const;
