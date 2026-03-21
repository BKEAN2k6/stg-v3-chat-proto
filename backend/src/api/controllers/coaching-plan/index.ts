import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCoachingPlans} from './getCoachingPlans.js';
import {getCoachingPlan} from './getCoachingPlan.js';
import {createCoachingPlan} from './createCoachingPlan.js';
import {updateCoachingPlan} from './updateCoachingPlan.js';
import {removeCoachingPlan} from './removeCoachingPlan.js';

const coachingPlanController: RouteConfigs = {
  '/coaching-plans': {
    get: {
      controller: getCoachingPlans,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/CoachingPlan',
        },
      },
      hookConfig: {
        resourceName: 'coachingPlan',
        queryType: 'list',
      },
    },
    post: {
      controller: createCoachingPlan,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          description: {type: 'string'},
          content: {type: 'string'},
          basePromptId: {type: 'string'},
          isPublished: {type: 'boolean'},
          order: {type: 'number'},
        },
        required: ['title', 'description', 'content', 'basePromptId'],
      },
      response: {
        $ref: '#/definitions/CoachingPlan',
      },
      hookConfig: {
        resourceName: 'coachingPlan',
      },
    },
  },
  '/coaching-plans/:id': {
    get: {
      controller: getCoachingPlan,
      access: ['super-admin'],
      response: {
        $ref: '#/definitions/CoachingPlan',
      },
      hookConfig: {
        resourceName: 'coachingPlan',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateCoachingPlan,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          title: {type: 'string'},
          description: {type: 'string'},
          content: {type: 'string'},
          basePromptId: {type: 'string'},
          isPublished: {type: 'boolean'},
          order: {type: 'number'},
        },
      },
      response: {
        $ref: '#/definitions/CoachingPlan',
      },
      hookConfig: {
        resourceName: 'coachingPlan',
      },
    },
    delete: {
      controller: removeCoachingPlan,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'coachingPlan',
      },
    },
  },
};

export default coachingPlanController;
