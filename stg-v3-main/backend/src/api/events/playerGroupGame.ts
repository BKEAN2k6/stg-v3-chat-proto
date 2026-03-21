import {type EventConfig} from '../../types/routeconfig.js';

export const playerGroupGame: EventConfig = {
  path: '/group-games/:id/player',
  name: 'PlayerGroupGame',
  access: ['public'],
  events: {
    patch: {
      type: 'object',
      properties: {
        isStarted: {type: 'boolean'},
        players: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        updatedAt: {type: 'string'},
      },
      required: ['isStarted', 'players', 'updatedAt'],
    },
  },
};
