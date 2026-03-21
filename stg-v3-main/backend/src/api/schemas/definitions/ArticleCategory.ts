export const ArticleCategory = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    parentCategory: {type: 'string'},
    subCategories: {
      type: 'array',
      items: {$ref: '#/definitions/ArticleCategory'},
    },
    thumbnail: {type: 'string'},
    displayAs: {type: 'string', enum: ['list', 'grid']},
    translations: {
      type: 'array',
      items: {
        $ref: '#/definitions/ArticleCategoryTranslation',
      },
    },
    order: {type: 'number'},
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                title: {type: 'string'},
                description: {type: 'string'},
                thumbnail: {type: 'string'},
              },
              required: ['language', 'title', 'description'],
            },
          },
          order: {type: 'number'},
          thumbnail: {type: 'string'},
          length: {type: 'string'},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
          isFree: {type: 'boolean'},
        },
        required: [
          'id',
          'translations',
          'order',
          'thumbnail',
          'length',
          'strengths',
          'isHidden',
          'isLocked',
          'isFree',
        ],
      },
    },
    categoryPath: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                name: {type: 'string'},
              },
              required: ['language', 'name'],
            },
          },
        },
        required: ['id', 'translations'],
      },
    },
    isHidden: {type: 'boolean'},
    isLocked: {type: 'boolean'},
  },
  required: [
    'id',
    'translations',
    'thumbnail',
    'displayAs',
    'subCategories',
    'order',
    'articles',
    'categoryPath',
    'isHidden',
    'isLocked',
  ],
} as const;
