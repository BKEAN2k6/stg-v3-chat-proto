import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getHostSprint} from './getHostSprint.js';
import {getPlayerSprint} from './getPlayerSprint.js';
import {createSprintStrength} from './createSprintStrength.js';
import {updateSprint} from './updateSprint.js';
import {createSprint} from './createSprint.js';

const sprintController: RouteConfigs = {
  '/groups/:id/sprints': {
    post: {
      controller: createSprint,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          code: {type: 'string'},
        },
        required: ['id', 'code'],
      },
    },
  },
  '/sprints/:id/host': {
    get: {
      controller: getHostSprint,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {$ref: '#/definitions/HostSprint'},
    },
    patch: {
      controller: updateSprint,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          isEnded: {type: 'boolean'},
        },
      },
      response: {$ref: '#/definitions/HostSprint'},
    },
  },
  '/sprints/:id/player': {
    get: {
      controller: getPlayerSprint,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          room: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                nickname: {type: 'string'},
                avatar: {type: 'string'},
                color: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['id', 'nickname', 'avatar', 'color'],
            },
          },
          players: {type: 'array', items: {type: 'string'}},
          isEnded: {type: 'boolean'},
          isCompleted: {type: 'boolean'},
          player: {$ref: '#/definitions/GroupGamePlayer'},
          receivedStrengths: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: {
                  type: 'object',
                  properties: {
                    nickname: {type: 'string'},
                    id: {type: 'string'},
                  },
                  required: ['nickname', 'id'],
                },
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['from', 'strength'],
            },
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'room',
          'players',
          'isEnded',
          'isCompleted',
          'player',
          'receivedStrengths',
          'updatedAt',
        ],
      },
    },
  },
  '/sprints/:id/strengths': {
    post: {
      controller: createSprintStrength,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          to: {type: 'string'},
          strength: {$ref: '#/definitions/StrengthSlug'},
        },
        required: ['to', 'strength'],
      },
      response: {
        type: 'object',
        properties: {
          to: {type: 'string'},
          strength: {$ref: '#/definitions/StrengthSlug'},
        },
        required: ['to', 'strength'],
      },
    },
  },
};

export default sprintController;
