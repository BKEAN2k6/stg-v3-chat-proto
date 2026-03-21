import {type EventConfig} from '../../types/routeconfig.js';

export const hostSprint: EventConfig = {
  path: '/sprints/:id/host',
  name: 'HostSprint',
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
        sharedStrengths: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              strength: {$ref: '#/definitions/StrengthSlug'},
              from: {type: 'string'},
              to: {type: 'string'},
            },
            required: ['strength', 'from', 'to'],
          },
        },
        isCompleted: {type: 'boolean'},
        isEnded: {type: 'boolean'},
        updatedAt: {type: 'string'},
      },
      required: [
        'players',
        'sharedStrengths',
        'isCompleted',
        'isEnded',
        'updatedAt',
      ],
    },
  },
};
