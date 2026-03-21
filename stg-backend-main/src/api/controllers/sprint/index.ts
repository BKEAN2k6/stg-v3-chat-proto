import {type RouteConfigs} from '../../../types/routeconfig';
import {createSprintPlayer} from './createSprintPlayer';
import {getHostSprint} from './getHostSprint';
import {getSprintWithCode} from './getSprintWithCode';
import {getPlayerSprint} from './getPlayerSprint';
import {removeSprintPlayer} from './removeSprintPlayer';
import {createSprintStrength} from './createSprintStrength';
import {updateSprint} from './updateSprint';

const sprintController: RouteConfigs = {
  '/sprints/:id/players': {
    post: {
      controller: createSprintPlayer,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          nickname: {type: 'string', maxLength: 50},
          avatar: {type: 'string'},
          color: {type: 'string'},
        },
        required: ['nickname', 'avatar', 'color'],
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          nickname: {type: 'string'},
          avatar: {type: 'string'},
          color: {type: 'string'},
        },
        required: ['_id', 'nickname', 'avatar', 'color'],
      },
    },
  },
  '/sprints/:id/host': {
    get: {
      controller: getHostSprint,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {$ref: '#/definitions/HostSprint'},
    },
    patch: {
      controller: updateSprint,
      access: ['community-member', 'community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
        },
      },
      response: {$ref: '#/definitions/HostSprint'},
    },
  },
  '/sprints/:code': {
    get: {
      controller: getSprintWithCode,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          isRegistered: {type: 'boolean'},
        },
        required: ['_id', 'isRegistered'],
      },
    },
  },
  '/sprints/:id/player': {
    get: {
      controller: getPlayerSprint,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          room: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                nickname: {type: 'string'},
                avatar: {type: 'string'},
                color: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['_id', 'nickname', 'avatar', 'color'],
            },
          },
          players: {type: 'array', items: {type: 'string'}},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          isCompleted: {type: 'boolean'},
          player: {
            type: 'object',
            properties: {
              _id: {type: 'string'},
              nickname: {type: 'string'},
              avatar: {type: 'string'},
              color: {type: 'string'},
            },
            required: ['_id', 'nickname', 'avatar', 'color'],
          },
          receivedStrengths: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: {
                  type: 'object',
                  properties: {
                    nickname: {type: 'string'},
                    _id: {type: 'string'},
                  },
                  required: ['nickname', '_id'],
                },
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['from', 'strength'],
            },
          },
        },
        required: [
          '_id',
          'room',
          'players',
          'isStarted',
          'isEnded',
          'isCompleted',
          'player',
          'receivedStrengths',
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
  '/sprints/:id/players/:playerId': {
    delete: {
      controller: removeSprintPlayer,
      access: ['community-member', 'community-admin', 'super-admin'],
    },
  },
};

export default sprintController;
