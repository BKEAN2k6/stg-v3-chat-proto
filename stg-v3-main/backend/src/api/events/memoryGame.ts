import {type EventConfig} from '../../types/routeconfig.js';

export const memoryGame: EventConfig = {
  path: '/memory-games/:id',
  name: 'MemoryGame',
  access: ['public'],
  events: {
    patch: {
      type: 'object',
      properties: {
        isEnded: {type: 'boolean'},
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
          items: {$ref: '#/definitions/GroupGamePlayer'},
        },
        updatedAt: {type: 'string'},
      },
      required: [
        'isEnded',
        'currentlyRevealedCards',
        'foundPairs',
        'currentPlayer',
        'players',
        'updatedAt',
      ],
    },
  },
};
