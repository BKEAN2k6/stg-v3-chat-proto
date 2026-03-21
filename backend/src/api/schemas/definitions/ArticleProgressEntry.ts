export const ArticleProgressEntry = {
  type: 'object',
  properties: {
    article: {type: 'string'},
    completionDate: {type: 'string'},
  },
  required: ['article', 'completionDate'],
} as const;
