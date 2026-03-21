export const ArticleCategoryTranslation = {
  type: 'object',
  properties: {
    language: {type: 'string', enum: ['fi', 'en', 'sv']},
    name: {type: 'string'},
    description: {type: 'string'},
  },
  required: ['language', 'name', 'description'],
} as const;
