export const CoachPost = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    comments: {
      type: 'array',
      items: {$ref: '#/definitions/Comment'},
    },
    reactions: {
      type: 'array',
      items: {$ref: '#/definitions/Reaction'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    postType: {type: 'string', enum: ['coach-post']},
    translations: {
      type: 'object',
      properties: {
        fi: {type: 'string'},
        en: {type: 'string'},
        sv: {type: 'string'},
      },
      required: ['fi', 'en', 'sv'],
    },
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
    },
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    isReference: {type: 'boolean'},
  },
  required: [
    'id',
    'comments',
    'reactions',
    'createdAt',
    'updatedAt',
    'postType',
    'translations',
    'images',
    'strengths',
  ],
} as const;
