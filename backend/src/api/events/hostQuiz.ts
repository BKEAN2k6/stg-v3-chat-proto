import {type EventConfig} from '../../types/routeconfig.js';

export const hostQuiz: EventConfig = {
  path: '/quizzes/:id/host',
  name: 'HostQuiz',
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
        answers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: {type: 'string'},
              choices: {type: 'array', items: {type: 'string'}},
              player: {type: 'string'},
            },
            required: ['question', 'choices', 'player'],
          },
        },
        updatedAt: {type: 'string'},
      },
      required: ['players', 'answers', 'updatedAt'],
    },
  },
};
