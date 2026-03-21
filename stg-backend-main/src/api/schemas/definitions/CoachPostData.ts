export const CoachPostData = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
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
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
    },
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    postType: {type: 'string', enum: ['coach-post']},
  },
  required: [
    '_id',
    'createdAt',
    'updatedAt',
    'translations',
    'showDate',
    'images',
    'strengths',
    'postType',
  ],
} as const;
