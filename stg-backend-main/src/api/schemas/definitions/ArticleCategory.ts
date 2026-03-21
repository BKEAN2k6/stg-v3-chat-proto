export const ArticleCategory = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
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
          _id: {type: 'string'},
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
          thumbnail: {type: 'string'},
          length: {type: 'string'},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
        required: [
          '_id',
          'translations',
          'order',
          'thumbnail',
          'length',
          'strengths',
          'isHidden',
          'isLocked',
        ],
      },
    },
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
    'displayAs',
    'subCategories',
    'order',
    'articles',
    'categoryPath',
    'isHidden',
    'isLocked',
  ],
} as const;
