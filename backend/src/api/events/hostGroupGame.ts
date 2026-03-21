import {type EventConfig} from '../../types/routeconfig.js';

export const hostGroupGame: EventConfig = {
  path: '/group-games/:id/host',
  name: 'HostGroupGame',
  access: [
    'community-member',
    'community-admin',
    'community-owner',
    'super-admin',
  ],
  events: {
    patch: {
      type: 'object',
      properties: {
        players: {
          type: 'array',
          items: {$ref: '#/definitions/GroupGamePlayer'},
        },
        updatedAt: {type: 'string'},
      },
      required: ['players', 'updatedAt'],
    },
  },
};
