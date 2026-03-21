export const ArticleTranslation = {
  type: 'object',
  properties: {
    language: {$ref: '#/definitions/LanguageCode'},
    title: {type: 'string'},
    description: {type: 'string'},
    content: {type: 'array', items: {type: 'string'}},
    thumbnail: {type: 'string'},
    requiresUpdate: {type: 'boolean'},
  },
  required: ['language', 'title', 'description', 'content', 'requiresUpdate'],
} as const;
