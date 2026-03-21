export const ArticleCategoryTranslation = {
  type: 'object',
  properties: {
    language: {$ref: '#/definitions/LanguageCode'},
    name: {type: 'string'},
    description: {type: 'string'},
    thumbnail: {type: 'string'},
  },
  required: ['language', 'name', 'description'],
} as const;
