export const GroupStats = {
  type: 'object',
  properties: {
    diplomas: {
      type: 'object',
      properties: {
        count: {type: 'number'},
        updatedAt: {type: 'string'},
      },
      required: ['count'],
    },
    lessons: {
      type: 'object',
      properties: {
        count: {type: 'number'},
        updatedAt: {type: 'string'},
      },
      required: ['count'],
    },
    games: {
      type: 'object',
      properties: {
        count: {type: 'number'},
        updatedAt: {type: 'string'},
        byType: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              slug: {type: 'string', enum: ['memory-game', 'sprint']},
              count: {type: 'number'},
            },
            required: ['slug', 'count'],
          },
        },
      },
      required: ['count', 'byType'],
    },
    goals: {
      type: 'object',
      properties: {
        count: {type: 'number'},
        updatedAt: {type: 'string'},
      },
      required: ['count'],
    },
    streak: {type: 'number'},
  },
  required: ['diplomas', 'lessons', 'games', 'goals', 'streak'],
} as const;
