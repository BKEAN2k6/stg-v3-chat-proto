export const ChallengeData = {
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
    theme: {$ref: '#/definitions/ChallengeTheme'},
    strength: {$ref: '#/definitions/StrengthSlug'},
    showDate: {type: 'string'},
    postType: {type: 'string', enum: ['challenge']},
  },
  required: [
    '_id',
    'createdAt',
    'updatedAt',
    'translations',
    'theme',
    'strength',
    'showDate',
    'postType',
  ],
} as const;
