export const Article = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    translations: {
      type: 'array',
      items: {$ref: '#/definitions/ArticleTranslation'},
    },
    thumbnail: {type: 'string'},
    length: {type: 'string'},
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    category: {type: 'string'},
    order: {type: 'number'},
    updatedAt: {type: 'string'},
    createdAt: {type: 'string'},
    updatedBy: {$ref: '#/definitions/UserInfo'},
    categoryPath: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string'},
                name: {type: 'string'},
              },
              required: ['language', 'name'],
            },
          },
        },
        required: ['_id', 'translations'],
      },
    },
    isHidden: {type: 'boolean'},
    isLocked: {type: 'boolean'},
  },
  required: [
    '_id',
    'translations',
    'thumbnail',
    'length',
    'strengths',
    'category',
    'order',
    'updatedAt',
    'createdAt',
    'updatedBy',
    'categoryPath',
    'isHidden',
    'isLocked',
  ],
} as const;
