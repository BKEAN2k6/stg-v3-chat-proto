export const CoachingBasePrompt = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    content: {type: 'string'},
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
  },
  required: ['id', 'name', 'content'],
} as const;
