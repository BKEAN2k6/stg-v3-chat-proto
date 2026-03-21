import {type RouteConfigs} from '../../../types/routeconfig';
import {updateArticle} from './updateArticle';
import {getArticle} from './getArticle';
import {createArticleImage} from './createArticleImage';
import {createArticleThumbnail} from './createArticleThumbnail';
import {createArticleAttachment} from './createArticleAttachment';
import {createArticle} from './createArticle';
import {removeArticle} from './removeArticle';
import {updateArticlesOrder} from './updateArticlesOrder';
import {createArticesBackup} from './createArticlesBackup';

const articleController: RouteConfigs = {
  '/articles/backup': {
    get: {
      controller: createArticesBackup,
      access: ['super-admin'],
    },
  },
  '/articles': {
    post: {
      controller: createArticle,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string', enum: ['fi', 'en', 'sv']},
                title: {type: 'string'},
                description: {type: 'string'},
                content: {type: 'array', items: {type: 'string'}},
              },
              required: ['language', 'title', 'description', 'content'],
            },
          },
          thumbnail: {type: 'string'},
          length: {type: 'string'},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
          category: {type: 'string'},
          order: {type: 'number'},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
        required: [
          'translations',
          'length',
          'strengths',
          'category',
          'order',
          'isHidden',
          'isLocked',
        ],
      },
      response: {
        $ref: '#/definitions/Article',
      },
    },
  },
  '/articles/order': {
    patch: {
      controller: updateArticlesOrder,
      access: ['super-admin'],
      request: {
        type: 'array',
        items: {type: 'string'},
      },
    },
  },
  '/articles/images': {
    post: {
      controller: createArticleImage,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          path: {type: 'string'},
        },
        required: ['path'],
      },
    },
  },
  '/articles/thumbnails': {
    post: {
      controller: createArticleThumbnail,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          path: {type: 'string'},
        },
        required: ['path'],
      },
    },
  },
  '/articles/attachments/:fileName': {
    post: {
      controller: createArticleAttachment,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          path: {type: 'string'},
        },
        required: ['path'],
      },
    },
  },
  '/articles/:id': {
    get: {
      controller: getArticle,
      access: ['authenticated'],
      response: {
        $ref: '#/definitions/Article',
      },
    },
    patch: {
      controller: updateArticle,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {type: 'string', enum: ['fi', 'en', 'sv']},
                title: {type: 'string'},
                description: {type: 'string'},
                content: {type: 'array', items: {type: 'string'}},
              },
              required: ['language', 'title', 'description', 'content'],
            },
          },
          thumbnail: {type: 'string'},
          length: {type: 'string'},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
          category: {type: 'string'},
          order: {type: 'number'},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
        },
      },
      response: {
        $ref: '#/definitions/Article',
      },
    },
    delete: {
      controller: removeArticle,
      access: ['super-admin'],
    },
  },
};

export default articleController;
