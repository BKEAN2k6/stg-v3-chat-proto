import {type RouteConfigs} from '../../../types/routeconfig';
import {getArticleCategories} from './getArticleCategories';
import {getArticleCategory} from './getArticleCategory';
import {createArticleCategory} from './createArticleCategory';
import {updateArticleCategory} from './updateArticleCategory';
import {removeArticleCategory} from './removeArticleCategory';
import {updateArticleCategoriesOrder} from './updateArticleCategoriesOrder';

const articleCategoryController: RouteConfigs = {
  '/article-categories': {
    get: {
      controller: getArticleCategories,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {$ref: '#/definitions/ArticleCategoryListItem'},
      },
    },

    post: {
      controller: createArticleCategory,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string', enum: ['en', 'fi', 'sv']},
                description: {type: 'string'},
                name: {type: 'string'},
              },
              required: ['language', 'name', 'description'],
            },
          },
          parentCategory: {type: 'string'},
          thumbnail: {type: 'string'},
          displayAs: {type: 'string', enum: ['list', 'grid']},
          order: {type: 'number'},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
        required: [
          'translations',
          'displayAs',
          'order',
          'isHidden',
          'isLocked',
        ],
      },
      response: {
        $ref: '#/definitions/ArticleCategory',
      },
    },
  },
  '/article-categories/order': {
    patch: {
      controller: updateArticleCategoriesOrder,
      access: ['super-admin'],
      request: {
        type: 'array',
        items: {type: 'string'},
      },
    },
  },
  '/article-categories/:id': {
    get: {
      controller: getArticleCategory,
      access: ['authenticated'],
      response: {
        $ref: '#/definitions/ArticleCategory',
      },
    },
    patch: {
      controller: updateArticleCategory,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string', enum: ['en', 'fi', 'sv']},
                description: {type: 'string'},
                name: {type: 'string'},
              },
              required: ['language', 'name', 'description'],
            },
          },
          parentCategory: {type: 'string'},
          thumbnail: {type: 'string'},
          displayAs: {type: 'string', enum: ['list', 'grid']},
          order: {type: 'number'},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
      },
      response: {
        $ref: '#/definitions/ArticleCategory',
      },
    },
    delete: {
      controller: removeArticleCategory,
      access: ['super-admin'],
    },
  },
};

export default articleCategoryController;
