export const Challenge = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    comments: {
      type: 'array',
      items: {$ref: '#/definitions/Comment'},
    },
    reactions: {
      type: 'array',
      items: {$ref: '#/definitions/Reaction'},
    },
    participations: {
      type: 'array',
      items: {$ref: '#/definitions/UserInfo'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    postType: {type: 'string', enum: ['challenge']},
    translations: {
      type: 'object',
      properties: {
        fi: {type: 'string'},
        en: {type: 'string'},
        sv: {type: 'string'},
      },
      required: ['fi', 'en', 'sv'],
    },
    theme: {$ref: '#/definitions/ChallengeTheme'},
    strength: {$ref: '#/definitions/StrengthSlug'},
    isReference: {type: 'boolean'},
  },
  required: [
    '_id',
    'comments',
    'reactions',
    'participations',
    'createdAt',
    'updatedAt',
    'postType',
    'translations',
    'theme',
    'strength',
  ],
} as const;
