import {type EventConfig} from '../../types/routeconfig.js';

export const playerQuiz: EventConfig = {
  path: '/quizzes/:id/player',
  name: 'PlayerQuiz',
  access: ['public'],
  events: {
    patch: {
      type: 'object',
      properties: {
        isStarted: {type: 'boolean'},
        isCompleted: {type: 'boolean'},
        isEnded: {type: 'boolean'},
        canAnswer: {type: 'boolean'},
        currentQuestion: {
          type: 'string',
        },
      },
    },
  },
};
