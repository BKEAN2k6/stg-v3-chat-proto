export const ChallengeData = {
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
    theme: {$ref: '#/definitions/ChallengeTheme'},
    strength: {$ref: '#/definitions/StrengthSlug'},
    showDate: {type: 'string'},
    isProcessing: {type: 'boolean'},
    postType: {type: 'string', enum: ['challenge']},
  },
  required: [
    'id',
    'createdAt',
    'updatedAt',
    'translations',
    'theme',
    'strength',
    'showDate',
    'isProcessing',
    'postType',
  ],
} as const;
