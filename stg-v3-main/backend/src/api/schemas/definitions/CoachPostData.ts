export const CoachPostData = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    translations: {
      type: 'object',
      properties: {
        fi: {type: 'string'},
        en: {type: 'string'},
        sv: {type: 'string'},
      },
      required: ['fi', 'en', 'sv'],
    },
    showDate: {type: 'string'},
    isProcessing: {type: 'boolean'},
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
    },
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    postType: {type: 'string', enum: ['coach-post']},
  },
  required: [
    'id',
    'createdAt',
    'updatedAt',
    'translations',
    'showDate',
    'isProcessing',
    'images',
    'strengths',
    'postType',
  ],
} as const;
