export const ArticleCategoryListItem = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    rootCategory: {type: 'string'},
    parentCategory: {type: 'string'},
    thumbnail: {type: 'string'},
    displayAs: {type: 'string', enum: ['list', 'grid']},
    translations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: {type: 'string'},
          name: {type: 'string'},
          description: {type: 'string'},
        },
        required: ['language', 'name', 'description'],
      },
    },
    order: {type: 'number'},
    subCategories: {
      type: 'array',
      items: {$ref: '#/definitions/ArticleCategoryListItem'},
    },
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          category: {type: 'string'},
          rootCategory: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string'},
                title: {type: 'string'},
                description: {type: 'string'},
              },
              required: ['language', 'title', 'description'],
            },
          },
          order: {type: 'number'},
        },
        required: ['_id', 'category', 'rootCategory', 'translations', 'order'],
      },
    },
    isHidden: {type: 'boolean'},
    isLocked: {type: 'boolean'},
  },
  required: [
    '_id',
    'rootCategory',
    'translations',
    'thumbnail',
    'displayAs',
    'order',
    'subCategories',
    'articles',
    'isHidden',
    'isLocked',
  ],
} as const;
