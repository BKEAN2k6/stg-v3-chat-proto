import {type EventConfig} from '../../types/routeconfig';

export const memoryGame: EventConfig = {
  path: '/memory-games/:id',
  name: 'MemoryGame',
  access: ['public'],
  events: {
    patch: {
      type: 'object',
      properties: {
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
        currentPlayer: {type: 'string'},
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
      },
    },
  },
};
