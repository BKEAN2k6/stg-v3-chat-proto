import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getProxyPosts} from './getProxyPosts.js';
import {getChallenge} from './getChallenge.js';
import {getCoachPost} from './getCoachPost.js';
import {createChallenge} from './createChallenge.js';
import {updateChallenge} from './updateChallenge.js';
import {removeProxyPost} from './removeProxyPost.js';
import {createCoachPost} from './createCoachPost.js';
import {updateCoachPost} from './updateCoachPost.js';
import {createProxyPostImage} from './createProxyPostImage.js';
import {exportCoachPosts} from './exportCoachPosts.js';

const communityController: RouteConfigs = {
  '/proxy-posts': {
    get: {
      controller: getProxyPosts,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          discriminator: {propertyName: 'postType'},
          required: ['postType'],
          oneOf: [
            {$ref: '#/definitions/ChallengeData'},
            {$ref: '#/definitions/CoachPostData'},
          ],
        },
      },
    },
  },
  '/proxy-posts/images': {
    post: {
      controller: createProxyPostImage,
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
  '/proxy-posts/:id': {
    delete: {
      controller: removeProxyPost,
      access: ['super-admin'],
    },
  },
  '/challenges': {
    post: {
      controller: createChallenge,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'object',
            properties: {
              fi: {type: 'string'},
              en: {type: 'string'},
              sv: {type: 'string'},
            },
            required: ['fi', 'en', 'sv'],
          },
          theme: {$ref: '#/definitions/ChallengeTheme'},
          strength: {$ref: '#/definitions/StrengthSlug'},
          showDate: {type: 'string'},
        },
        required: ['translations', 'theme', 'strength', 'showDate'],
      },
      response: {$ref: '#/definitions/ChallengeData'},
    },
  },
  '/challenges/:id': {
    get: {
      controller: getChallenge,
      access: ['super-admin'],
      response: {$ref: '#/definitions/ChallengeData'},
    },
    patch: {
      controller: updateChallenge,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'object',
            properties: {
              fi: {type: 'string'},
              en: {type: 'string'},
              sv: {type: 'string'},
            },
            required: ['fi', 'en', 'sv'],
          },
          theme: {$ref: '#/definitions/ChallengeTheme'},
          strength: {$ref: '#/definitions/StrengthSlug'},
          showDate: {type: 'string'},
        },
      },
    },
  },
  '/coach-posts/export': {
    get: {
      controller: exportCoachPosts,
      access: ['super-admin'],
      response: {
        type: 'string',
      },
    },
  },
  '/coach-posts': {
    post: {
      controller: createCoachPost,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'object',
            properties: {
              fi: {type: 'string'},
              en: {type: 'string'},
              sv: {type: 'string'},
            },
            required: ['fi', 'en', 'sv'],
          },
          showDate: {type: 'string'},
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
        },
        required: ['translations', 'showDate', 'images', 'strengths'],
      },
      response: {$ref: '#/definitions/CoachPostData'},
    },
  },
  '/coach-posts/:id': {
    get: {
      controller: getCoachPost,
      access: ['super-admin'],
      response: {$ref: '#/definitions/CoachPostData'},
    },
    patch: {
      controller: updateCoachPost,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          translations: {
            type: 'object',
            properties: {
              fi: {type: 'string'},
              en: {type: 'string'},
              sv: {type: 'string'},
            },
            required: ['fi', 'en', 'sv'],
          },
          theme: {$ref: '#/definitions/ChallengeTheme'},
          showDate: {type: 'string'},
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
          },
        },
      },
    },
  },
};

export default communityController;
