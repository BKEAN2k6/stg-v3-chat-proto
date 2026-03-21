import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getHostMemoryGame} from './getHostMemoryGame.js';
import {getPlayerMemoryGame} from './getPlayerMemoryGame.js';
import {updateMemoryGame} from './updateMemoryGame.js';
import {createMemoryGamePick} from './createMemoryGamePick.js';
import {createMemoryGame} from './createMemoryGame.js';
import {skipPlayer} from './skipPlayer.js';

const memoryGameController: RouteConfigs = {
  '/groups/:id/memory-games': {
    post: {
      controller: createMemoryGame,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          numberOfCards: {type: 'number', enum: [16, 36]},
        },
        required: ['numberOfCards'],
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
        },
        required: ['id'],
      },
    },
  },
  '/memory-games/:id/host': {
    get: {
      controller: getHostMemoryGame,
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
          isEnded: {type: 'boolean'},
          isCodeActive: {type: 'boolean'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['id', 'strength'],
            },
          },
          currentlyRevealedCards: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          foundPairs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                player: {type: 'string'},
                card1: {type: 'string'},
                card2: {type: 'string'},
              },
              required: ['player', 'card1', 'card2'],
            },
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          currentPlayer: {
            type: 'string',
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isEnded',
          'isCodeActive',
          'cards',
          'players',
          'currentlyRevealedCards',
          'foundPairs',
          'currentPlayer',
          'updatedAt',
        ],
      },
    },
    patch: {
      controller: updateMemoryGame,
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
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isEnded: {type: 'boolean'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['id', 'strength'],
            },
          },
          currentlyRevealedCards: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          foundPairs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                player: {type: 'string'},
                card1: {type: 'string'},
                card2: {type: 'string'},
              },
              required: ['player', 'card1', 'card2'],
            },
          },
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          currentPlayer: {
            type: 'string',
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isEnded',
          'cards',
          'players',
          'currentlyRevealedCards',
          'foundPairs',
          'currentPlayer',
          'updatedAt',
        ],
      },
    },
  },
  '/memory-games/:id/player': {
    get: {
      controller: getPlayerMemoryGame,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          isEnded: {type: 'boolean'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['id', 'strength'],
            },
          },
          currentlyRevealedCards: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          foundPairs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                player: {type: 'string'},
                card1: {type: 'string'},
                card2: {type: 'string'},
              },
              required: ['player', 'card1', 'card2'],
            },
          },
          player: {$ref: '#/definitions/GroupGamePlayer'},
          players: {
            type: 'array',
            items: {$ref: '#/definitions/GroupGamePlayer'},
          },
          currentPlayer: {
            type: 'string',
          },
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'isEnded',
          'cards',
          'currentlyRevealedCards',
          'foundPairs',
          'player',
          'players',
          'currentPlayer',
          'updatedAt',
        ],
      },
    },
  },
  '/memory-games/:id/picks': {
    post: {
      controller: createMemoryGamePick,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          cardId: {type: 'string'},
        },
        required: ['cardId'],
      },
    },
  },
  '/memory-games/:id/skip': {
    post: {
      controller: skipPlayer,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
    },
  },
};

export default memoryGameController;
