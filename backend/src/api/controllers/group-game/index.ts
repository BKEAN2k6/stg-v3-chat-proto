import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getGroupGameWithCode} from './getGroupGameWithCode.js';
import {getGroupGameWithId} from './getGroupGameWithId.js';
import {createGroupGamePlayer} from './createGroupGamePlayer.js';
import {removeGroupGamePlayer} from './removeGroupGamePlayer.js';
import {updateGroupGame} from './updateGroupGame.js';

const groupGameController: RouteConfigs = {
  '/group-games/player/:code': {
    get: {
      controller: getGroupGameWithCode,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          gameType: {type: 'string'},
          player: {$ref: '#/definitions/GroupGamePlayer'},
          players: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          updatedAt: {type: 'string'},
          isStarted: {type: 'boolean'},
        },
        required: ['id', 'gameType', 'players', 'updatedAt'],
      },
    },
  },
  '/group-games/host/:id': {
    get: {
      controller: getGroupGameWithId,
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
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          isCodeActive: {type: 'boolean'},
          code: {type: 'string'},
          gameType: {type: 'string'},
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isStarted',
          'isEnded',
          'isCodeActive',
          'code',
          'gameType',
          'players',
          'updatedAt',
        ],
      },
    },
    patch: {
      controller: updateGroupGame,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          isStarted: {type: 'boolean'},
        },
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isStarted: {type: 'boolean'},
          code: {type: 'string'},
          gameType: {type: 'string'},
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isStarted',
          'code',
          'gameType',
          'players',
          'updatedAt',
        ],
      },
    },
  },
  '/group-games/:id/players': {
    post: {
      controller: createGroupGamePlayer,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          nickname: {type: 'string', minLength: 1, maxLength: 20},
          color: {type: 'string'},
          avatar: {type: 'string'},
        },
        required: ['nickname', 'color', 'avatar'],
      },
      response: {$ref: '#/definitions/GroupGamePlayer'},
    },
  },
  '/group-games/:id/players/:playerId': {
    delete: {
      controller: removeGroupGamePlayer,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
    },
  },
};

export default groupGameController;
