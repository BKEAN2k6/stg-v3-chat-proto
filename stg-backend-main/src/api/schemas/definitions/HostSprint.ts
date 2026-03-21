export const HostSprint = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    code: {type: 'string'},
    isStarted: {type: 'boolean'},
    isCompleted: {type: 'boolean'},
    isEnded: {type: 'boolean'},
    expectedStrengthCount: {type: 'number'},
    players: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          nickname: {type: 'string'},
          color: {type: 'string'},
        },
        required: ['_id', 'nickname', 'color'],
      },
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
  },
  required: [
    '_id',
    'code',
    'isStarted',
    'isCompleted',
    'isEnded',
    'expectedStrengthCount',
    'players',
    'sharedStrengths',
  ],
} as const;
