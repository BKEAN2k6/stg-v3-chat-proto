export const ArticleCategoryListItem = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    rootCategory: {type: 'string'},
    parentCategory: {type: 'string'},
    thumbnail: {type: 'string'},
    displayAs: {type: 'string', enum: ['list', 'grid']},
    translations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: {$ref: '#/definitions/LanguageCode'},
          name: {type: 'string'},
          description: {type: 'string'},
          thumbnail: {type: 'string'},
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
          id: {type: 'string'},
          category: {type: 'string'},
          rootCategory: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                title: {type: 'string'},
                description: {type: 'string'},
                thumbnail: {type: 'string'},
                requiresUpdate: {type: 'boolean'},
              },
              required: ['language', 'title', 'description', 'requiresUpdate'],
            },
          },
          order: {type: 'number'},
          isFree: {type: 'boolean'},
        },
        required: [
          'id',
          'category',
          'rootCategory',
          'translations',
          'order',
          'isFree',
        ],
      },
    },
    isHidden: {type: 'boolean'},
    isLocked: {type: 'boolean'},
  },
  required: [
    'id',
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
