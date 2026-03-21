export const StrengthGoal = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    description: {type: 'string'},
    strength: {$ref: '#/definitions/StrengthSlug'},
    target: {type: 'number'},
    targetDate: {type: 'string'},
    isSystemCreated: {type: 'boolean'},
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    group: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        name: {type: 'string'},
      },
      required: ['id', 'name'],
    },
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          createdAt: {type: 'string'},
        },
        required: ['createdAt'],
      },
    },
  },
  required: [
    'id',
    'strength',
    'target',
    'targetDate',
    'createdAt',
    'updatedAt',
    'group',
    'events',
  ],
} as const;
