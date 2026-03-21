export const MultipleChoiceOption = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    label: {type: 'string'},
    emoji: {type: 'string'},
  },
  required: ['id', 'label'],
} as const;

export const InteractiveMetadata = {
  type: 'object',
  properties: {
    type: {type: 'string', enum: ['multiple_choice', 'thumbs']},
    options: {
      type: 'array',
      items: {$ref: '#/definitions/MultipleChoiceOption'},
    },
    selectedOptionId: {type: 'string'},
    selectedValue: {type: 'string', enum: ['up', 'down']},
  },
  required: ['type'],
} as const;

export const CoachingSessionMessage = {
  type: 'object',
  properties: {
    role: {type: 'string', enum: ['user', 'assistant', 'system']},
    content: {type: 'string'},
    createdAt: {type: 'string'},
    metadata: {$ref: '#/definitions/InteractiveMetadata'},
  },
  required: ['role', 'content', 'createdAt'],
} as const;

export const CoachingSession = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    planTitle: {type: 'string'},
    planDescription: {type: 'string'},
    status: {type: 'string', enum: ['active', 'completed', 'abandoned']},
    messages: {
      type: 'array',
      items: {$ref: '#/definitions/CoachingSessionMessage'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    completedAt: {type: 'string'},
    error: {type: 'string'},
  },
  required: [
    'id',
    'planTitle',
    'planDescription',
    'status',
    'messages',
    'createdAt',
    'updatedAt',
  ],
} as const;
