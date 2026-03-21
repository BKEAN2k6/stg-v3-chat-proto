import {type RouteConfigs} from '../../../types/routeconfig.js';
import {updateArticle} from './updateArticle.js';
import {getArticle} from './getArticle.js';
import {createArticleImage} from './createArticleImage.js';
import {createArticleThumbnail} from './createArticleThumbnail.js';
import {createArticleAttachment} from './createArticleAttachment.js';
import {createArticle} from './createArticle.js';
import {removeArticle} from './removeArticle.js';
import {updateArticlesOrder} from './updateArticlesOrder.js';
import {createTranlationJob} from './createTranlationJob.js';
import {getTranslationJob} from './getTranslationJob.js';
import {getArticleHistories} from './getArticleHistories.js';
import {getArticleHistory} from './getArticleHistory.js';
import {getTimelineArticles} from './getTimelineArticles.js';

const articleController: RouteConfigs = {
  '/articles/translations-job/': {
    post: {
      controller: createTranlationJob,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          source: {
            type: 'object',
            properties: {
              language: {$ref: '#/definitions/LanguageCode'},
              title: {type: 'string'},
              description: {type: 'string'},
              content: {type: 'array', items: {type: 'string'}},
            },
            required: ['language', 'title', 'description', 'content'],
          },
          targetLanguage: {$ref: '#/definitions/LanguageCode'},
        },
        required: ['source', 'targetLanguage'],
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isFinished: {type: 'boolean'},
        },
        required: ['id', 'isFinished'],
      },
    },
  },
  '/articles/translations-job/:id': {
    get: {
      controller: getTranslationJob,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          result: {
            type: 'object',
            properties: {
              language: {$ref: '#/definitions/LanguageCode'},
              title: {type: 'string'},
              description: {type: 'string'},
              content: {type: 'array', items: {type: 'string'}},
            },
            required: ['language', 'title', 'description', 'content'],
          },
          errorMessage: {type: 'string'},
          isFinished: {type: 'boolean'},
        },
        required: ['id', 'isFinished'],
      },
    },
  },
  '/articles': {
    post: {
      controller: createArticle,
      access: ['super-admin'],
      request: {
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
                content: {type: 'array', items: {type: 'string'}},
                thumbnail: {type: 'string'},
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
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
          isFree: {type: 'boolean'},
          isTimelineArticle: {type: 'boolean'},
          timelineChapter: {$ref: '#/definitions/ArticleChapter'},
          timelineAgeGroup: {$ref: '#/definitions/AgeGroup'},
          timelineStrength: {$ref: '#/definitions/StrengthSlug'},
        },
        required: [
          'translations',
          'length',
          'strengths',
          'category',
          'isHidden',
          'isLocked',
          'isFree',
          'isTimelineArticle',
          'timelineChapter',
          'timelineAgeGroup',
          'timelineStrength',
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
      hookConfig: {
        resourceName: 'article',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateArticle,
      access: ['super-admin'],
      request: {
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
                content: {type: 'array', items: {type: 'string'}},
                thumbnail: {type: 'string'},
                requiresUpdate: {type: 'boolean'},
              },
              required: [
                'language',
                'title',
                'description',
                'content',
                'requiresUpdate',
              ],
            },
          },
          thumbnail: {type: 'string'},
          length: {type: 'string'},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
          category: {type: 'string'},
          isHidden: {type: 'boolean'},
          isLocked: {type: 'boolean'},
          isFree: {type: 'boolean'},
          isTimelineArticle: {type: 'boolean'},
          timelineChapter: {$ref: '#/definitions/ArticleChapter'},
          timelineAgeGroup: {$ref: '#/definitions/AgeGroup'},
          timelineStrength: {$ref: '#/definitions/StrengthSlug'},
          changeLog: {type: 'string'},
        },
        required: ['changeLog'],
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
  '/articles/:id/history': {
    get: {
      controller: getArticleHistories,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            documentId: {type: 'string'},
            changeLog: {type: 'string'},
            timestamp: {type: 'string'},
            data: {
              type: 'object',
              properties: {
                updatedBy: {
                  type: 'object',
                  properties: {
                    firstName: {type: 'string'},
                    lastName: {type: 'string'},
                  },
                },
              },
            },
          },
          required: ['id', 'documentId', 'changeLog', 'timestamp', 'data'],
        },
      },
    },
  },
  '/articles-history/:id': {
    get: {
      controller: getArticleHistory,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          documentId: {type: 'string'},
          changeLog: {type: 'string'},
          timestamp: {type: 'string'},
          data: {
            type: 'object',
          },
        },
        required: ['id', 'documentId', 'changeLog', 'timestamp', 'data'],
      },
    },
  },
  '/timeline-articles': {
    get: {
      controller: getTimelineArticles,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/TimelineArticle',
        },
      },
      hookConfig: {
        resourceName: 'timeline-article',
        queryType: 'list',
      },
    },
  },
};

export default articleController;
