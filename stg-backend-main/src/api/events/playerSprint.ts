import {type EventConfig} from '../../types/routeconfig';

export const playerSprint: EventConfig = {
  path: '/sprints/:id/player',
  name: 'PlayerSprint',
  access: ['public'],
  events: {
    patch: {
      type: 'object',
      properties: {
        isStarted: {type: 'boolean'},
        isCompleted: {type: 'boolean'},
        isEnded: {type: 'boolean'},
        players: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  },
};
