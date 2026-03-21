export const Group = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    description: {type: 'string'},
    owner: {$ref: '#/definitions/UserInfo'},
    language: {$ref: '#/definitions/LanguageCode'},
    ageGroup: {$ref: '#/definitions/AgeGroup'},
    articleProgress: {
      type: 'array',
      items: {
        $ref: '#/definitions/ArticleProgressEntry',
      },
    },
  },
  required: [
    'id',
    'name',
    'description',
    'owner',
    'language',
    'ageGroup',
    'articleProgress',
  ],
} as const;
