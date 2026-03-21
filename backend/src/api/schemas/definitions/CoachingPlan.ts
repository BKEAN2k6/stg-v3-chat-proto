export const CoachingPlan = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    title: {type: 'string'},
    description: {type: 'string'},
    content: {type: 'string'},
    basePromptId: {type: 'string'},
    isPublished: {type: 'boolean'},
    order: {type: 'number'},
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
  },
  required: [
    'id',
    'title',
    'description',
    'isPublished',
    'order',
    'basePromptId',
  ],
} as const;
