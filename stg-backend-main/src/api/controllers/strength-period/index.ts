import {type RouteConfigs} from '../../../types/routeconfig';
import {createStrengthPeriod} from './createStrengthPeriod';
import {getStrengthPeriods} from './getStrengthPeriods';
import {updateStrengthPeriod} from './updateStrengthPeriod';
import {removeStrengthPeriod} from './removeStrengthPeriod';

const strengthPeriodController: RouteConfigs = {
  '/strength-periods': {
    get: {
      controller: getStrengthPeriods,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {$ref: '#/definitions/StrengthPeriod'},
      },
    },
    post: {
      controller: createStrengthPeriod,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          timeline: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: {
                  type: 'string',
                },
                articleId: {type: 'string'},
              },
              required: ['start', 'articleId'],
            },
          },
          strength: {$ref: '#/definitions/StrengthSlug'},
        },
        required: ['timeline', 'strength'],
      },
      response: {$ref: '#/definitions/StrengthPeriod'},
    },
  },
  '/strength-periods/:id': {
    delete: {
      controller: removeStrengthPeriod,
      access: ['super-admin'],
    },
    patch: {
      controller: updateStrengthPeriod,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
          timeline: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: {
                  type: 'string',
                },
                articleId: {type: 'string'},
              },
              required: ['start', 'articleId'],
            },
          },
        },
      },
      response: {$ref: '#/definitions/StrengthPeriod'},
    },
  },
};

export default strengthPeriodController;
