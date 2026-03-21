export const HostSprint = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    isCompleted: {type: 'boolean'},
    isEnded: {type: 'boolean'},
    isCodeActive: {type: 'boolean'},
    expectedStrengthCount: {type: 'number'},
    players: {
      type: 'array',
      items: {$ref: '#/definitions/GroupGamePlayer'},
    },
    sharedStrengths: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
          from: {type: 'string'},
          to: {type: 'string'},
        },
        required: ['strength', 'from', 'to'],
      },
    },
    updatedAt: {type: 'string'},
  },
  required: [
    'id',
    'isCompleted',
    'isEnded',
    'isCodeActive',
    'expectedStrengthCount',
    'players',
    'sharedStrengths',
    'updatedAt',
  ],
} as const;
