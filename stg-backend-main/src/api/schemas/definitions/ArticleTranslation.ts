export const ArticleTranslation = {
  type: 'object',
  properties: {
    language: {type: 'string', enum: ['fi', 'en', 'sv']},
    title: {type: 'string'},
    description: {type: 'string'},
    content: {type: 'array', items: {type: 'string'}},
  },
  required: ['language', 'title', 'description', 'content'],
} as const;
