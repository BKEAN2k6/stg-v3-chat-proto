import {type EventConfig} from '../../types/routeconfig';

export const hostSprint: EventConfig = {
  path: '/sprints/:id/host',
  name: 'HostSprint',
  access: ['community-member', 'community-admin'],
  events: {
    patch: {
      type: 'object',
      properties: {
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
      },
    },
  },
};
