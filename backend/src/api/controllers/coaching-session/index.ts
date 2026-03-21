import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCoachingSessions} from './getCoachingSessions.js';
import {getCoachingSession} from './getCoachingSession.js';
import {createCoachingSession} from './createCoachingSession.js';
import {updateCoachingSession} from './updateCoachingSession.js';
import {removeCoachingSession} from './removeCoachingSession.js';
import {sendCoachingMessage} from './sendCoachingMessage.js';
import {getAvailableCoachingPlans} from './getAvailableCoachingPlans.js';
import {getAllCoachingSessions} from './getAllCoachingSessions.js';

const coachingSessionController: RouteConfigs = {
  '/coaching-sessions': {
    get: {
      controller: getCoachingSessions,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/CoachingSession',
        },
      },
      hookConfig: {
        resourceName: 'coachingSession',
        queryType: 'list',
      },
    },
    post: {
      controller: createCoachingSession,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          planId: {type: 'string'},
        },
        required: ['planId'],
      },
      response: {
        $ref: '#/definitions/CoachingSession',
      },
      hookConfig: {
        resourceName: 'coachingSession',
      },
    },
  },
  '/coaching-sessions/:id': {
    get: {
      controller: getCoachingSession,
      access: ['authenticated'],
      response: {
        $ref: '#/definitions/CoachingSession',
      },
      hookConfig: {
        resourceName: 'coachingSession',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateCoachingSession,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          status: {type: 'string', enum: ['active', 'completed', 'abandoned']},
        },
      },
      response: {
        $ref: '#/definitions/CoachingSession',
      },
      hookConfig: {
        resourceName: 'coachingSession',
      },
    },
    delete: {
      controller: removeCoachingSession,
      access: ['authenticated'],
      hookConfig: {
        resourceName: 'coachingSession',
      },
    },
  },
  '/coaching-sessions/:id/messages': {
    post: {
      controller: sendCoachingMessage,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          content: {type: 'string'},
          retryContext: {
            type: 'object',
            properties: {
              malformedResponse: {type: 'string'},
              validationError: {type: 'string'},
            },
            required: ['malformedResponse', 'validationError'],
          },
        },
        required: ['content'],
      },
      response: {
        type: 'object',
        properties: {
          message: {type: 'string'},
          session: {$ref: '#/definitions/CoachingSession'},
          error: {type: 'string'},
          retryContext: {
            type: 'object',
            properties: {
              malformedResponse: {type: 'string'},
              validationError: {type: 'string'},
            },
            required: ['malformedResponse', 'validationError'],
          },
        },
        required: ['message', 'session'],
      },
      hookConfig: {
        resourceName: 'coachingSession',
        subResourceName: 'messages',
      },
    },
  },
  '/available-coaching-plans': {
    get: {
      controller: getAvailableCoachingPlans,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            title: {type: 'string'},
            description: {type: 'string'},
          },
          required: ['id', 'title', 'description'],
        },
      },
      hookConfig: {
        resourceName: 'availableCoachingPlan',
        queryType: 'list',
      },
    },
  },
  '/admin/coaching-sessions': {
    get: {
      controller: getAllCoachingSessions,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            planTitle: {type: 'string'},
            planDescription: {type: 'string'},
            planContent: {type: 'string'},
            basePromptContent: {type: 'string'},
            status: {
              type: 'string',
              enum: ['active', 'completed', 'abandoned'],
            },
            messages: {
              type: 'array',
              items: {$ref: '#/definitions/CoachingSessionMessage'},
            },
            createdAt: {type: 'string'},
            updatedAt: {type: 'string'},
            completedAt: {type: 'string'},
            summary: {
              type: 'object',
              properties: {
                title: {type: 'string'},
                content: {type: 'string'},
                completedAt: {type: 'string'},
              },
            },
            user: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                email: {type: 'string'},
              },
            },
          },
          required: ['id', 'planTitle', 'status', 'messages'],
        },
      },
      hookConfig: {
        resourceName: 'adminCoachingSession',
        queryType: 'list',
      },
    },
  },
};

export default coachingSessionController;
