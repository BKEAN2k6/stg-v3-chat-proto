import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getArticleCategories} from './getArticleCategories.js';
import {getArticleCategory} from './getArticleCategory.js';
import {createArticleCategory} from './createArticleCategory.js';
import {updateArticleCategory} from './updateArticleCategory.js';
import {removeArticleCategory} from './removeArticleCategory.js';
import {updateArticleCategoriesOrder} from './updateArticleCategoriesOrder.js';

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
                language: {$ref: '#/definitions/LanguageCode'},
                description: {type: 'string'},
                name: {type: 'string'},
                thumbnail: {type: 'string'},
              },
              required: ['language', 'name', 'description'],
            },
          },
          parentCategory: {type: 'string'},
          thumbnail: {type: 'string'},
          displayAs: {type: 'string', enum: ['list', 'grid']},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
        required: ['translations', 'displayAs', 'isHidden', 'isLocked'],
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
      hookConfig: {
        resourceName: 'articleCategory',
        queryType: 'detail',
        keyParamName: 'id',
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
                language: {$ref: '#/definitions/LanguageCode'},
                description: {type: 'string'},
                name: {type: 'string'},
                thumbnail: {type: 'string'},
              },
              required: ['language', 'name', 'description'],
            },
          },
          parentCategory: {anyOf: [{type: 'string'}, {type: 'null'}]},
          thumbnail: {type: 'string'},
          displayAs: {type: 'string', enum: ['list', 'grid']},
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
