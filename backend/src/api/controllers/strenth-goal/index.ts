import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getStrengthGoals} from './getStrengthGoals.js';
import {createStrengthGoal} from './createStrengthGoal.js';
import {removeStrengthGoal} from './removeStrengthGoal.js';
import {updateStrengthGoal} from './updateStrengthGoal.js';
import {removeStrengthGoalsByStrength} from './removeStrengthGoalsByStrength.js';
import {createStrengthGoalEvent} from './createStrengthGoalEvent.js';
import {getStrengthGoal} from './getStrengthGoal.js';
import {getGroupStrengthCompletedCount} from './getGroupStrengthCompletedCount.js';

const strengthGoalController: RouteConfigs = {
  '/groups/:id/strength-goals': {
    get: {
      hookConfig: {
        resourceName: 'strengthGoal',
        queryType: 'list',
        keyParamName: 'id',
      },
      controller: getStrengthGoals,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/StrengthGoal',
        },
      },
    },
    post: {
      hookConfig: {
        resourceName: 'strengthGoal',
      },
      controller: createStrengthGoal,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
          description: {type: 'string'},
          target: {type: 'number'},
          targetDate: {type: 'string'},
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                createdAt: {type: 'string'},
              },
              required: ['createdAt'],
            },
          },
          isSystemCreated: {type: 'boolean'},
        },
        required: ['strength', 'target', 'targetDate'],
      },
      response: {
        $ref: '#/definitions/StrengthGoal',
      },
    },
    delete: {
      controller: removeStrengthGoalsByStrength,
      hookConfig: {
        resourceName: 'strengthGoal',
      },
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      query: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
        },
        required: ['strength'],
      },
    },
  },
  '/strength-goals/:id': {
    get: {
      hookConfig: {
        resourceName: 'strengthGoal',
        queryType: 'detail',
        keyParamName: 'id',
      },
      controller: getStrengthGoal,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        $ref: '#/definitions/StrengthGoal',
      },
    },
    patch: {
      hookConfig: {
        resourceName: 'strengthGoal',
      },
      controller: updateStrengthGoal,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          strength: {$ref: '#/definitions/StrengthSlug'},
          description: {type: 'string'},
          target: {type: 'number'},
          targetDate: {type: 'string'},
        },
      },
      response: {
        $ref: '#/definitions/StrengthGoal',
      },
    },
    delete: {
      hookConfig: {
        resourceName: 'strengthGoal',
      },
      controller: removeStrengthGoal,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
    },
  },
  '/strength-goals/:id/events': {
    post: {
      hookConfig: {
        resourceName: 'strengthGoal',
        subResourceName: 'events',
      },
      controller: createStrengthGoalEvent,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'object',
        properties: {
          createdAt: {type: 'string'},
        },
        required: ['createdAt'],
      },
    },
  },
  '/groups/:id/strength-goals/:strength/completed-count': {
    get: {
      controller: getGroupStrengthCompletedCount,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'number',
      },
      hookConfig: {
        resourceName: 'strengthCompletedCount',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
  },
};

export default strengthGoalController;
