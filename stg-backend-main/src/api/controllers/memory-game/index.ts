import {type RouteConfigs} from '../../../types/routeconfig';
import {createMemoryGame} from './createMemoryGame';
import {createMemoryGamePlayer} from './createMemoryGamePlayer';
import {getHostMemoryGame} from './getHostMemoryGame';
import {getMemoryGameWithCode} from './getMemoryGameWithCode';
import {getPlayerMemoryGame} from './getPlayerMemoryGame';
import {removeMemoryGamePlayer} from './removeMemoryGamePlayer';
import {updateMemoryGame} from './updateMemoryGame';
import {createMemoryGamePick} from './createMemoryGamePick';

const memoryGameController: RouteConfigs = {
  '/community/:id/memory-games': {
    post: {
      controller: createMemoryGame,
      access: ['community-member', 'community-admin', 'super-admin'],
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
          _id: {type: 'string'},
        },
        required: ['_id'],
      },
    },
  },

  '/memory-games/:id/players': {
    post: {
      controller: createMemoryGamePlayer,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          nickname: {type: 'string', maxLength: 50},
          color: {type: 'string'},
        },
        required: ['nickname', 'color'],
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          nickname: {type: 'string'},
          color: {type: 'string'},
        },
        required: ['_id', 'nickname', 'color'],
      },
    },
  },
  '/memory-games/:id/host': {
    get: {
      controller: getHostMemoryGame,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          code: {type: 'string'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['_id', 'strength'],
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
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                nickname: {type: 'string'},
                color: {type: 'string'},
              },
              required: ['_id', 'nickname', 'color'],
            },
          },
          currentPlayer: {
            type: 'string',
          },
        },
        required: [
          '_id',
          'isStarted',
          'isEnded',
          'code',
          'cards',
          'players',
          'currentlyRevealedCards',
          'foundPairs',
        ],
      },
    },
    patch: {
      controller: updateMemoryGame,
      access: ['community-member', 'community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
        },
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          code: {type: 'string'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['_id', 'strength'],
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
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                nickname: {type: 'string'},
                color: {type: 'string'},
              },
              required: ['_id', 'nickname', 'color'],
            },
          },
          currentPlayer: {
            type: 'string',
          },
        },
        required: [
          '_id',
          'isStarted',
          'isEnded',
          'code',
          'cards',
          'players',
          'currentlyRevealedCards',
          'foundPairs',
        ],
      },
    },
  },
  '/memory-games/:code': {
    get: {
      controller: getMemoryGameWithCode,
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
  '/memory-games/:id/player': {
    get: {
      controller: getPlayerMemoryGame,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          isStarted: {type: 'boolean'},
          isEnded: {type: 'boolean'},
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                strength: {$ref: '#/definitions/StrengthSlug'},
              },
              required: ['_id', 'strength'],
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
          player: {
            type: 'object',
            properties: {
              _id: {type: 'string'},
              nickname: {type: 'string'},
              color: {type: 'string'},
            },
            required: ['_id', 'nickname', 'color'],
          },
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                nickname: {type: 'string'},
                color: {type: 'string'},
              },
              required: ['_id', 'nickname', 'color'],
            },
          },
          currentPlayer: {
            type: 'string',
          },
        },
        required: [
          '_id',
          'isStarted',
          'isEnded',
          'cards',
          'currentlyRevealedCards',
          'foundPairs',
          'player',
          'players',
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
  '/memory-games/:id/players/:playerId': {
    delete: {
      controller: removeMemoryGamePlayer,
      access: ['community-member', 'community-admin', 'super-admin'],
    },
  },
};

export default memoryGameController;
