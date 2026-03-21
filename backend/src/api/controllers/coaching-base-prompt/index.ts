import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCoachingBasePrompts} from './getCoachingBasePrompts.js';
import {getCoachingBasePrompt} from './getCoachingBasePrompt.js';
import {createCoachingBasePrompt} from './createCoachingBasePrompt.js';
import {updateCoachingBasePrompt} from './updateCoachingBasePrompt.js';
import {removeCoachingBasePrompt} from './removeCoachingBasePrompt.js';

const coachingBasePromptController: RouteConfigs = {
  '/coaching-base-prompts': {
    get: {
      controller: getCoachingBasePrompts,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/CoachingBasePrompt',
        },
      },
      hookConfig: {
        resourceName: 'coachingBasePrompt',
        queryType: 'list',
      },
    },
    post: {
      controller: createCoachingBasePrompt,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          content: {type: 'string'},
        },
        required: ['name', 'content'],
      },
      response: {
        $ref: '#/definitions/CoachingBasePrompt',
      },
      hookConfig: {
        resourceName: 'coachingBasePrompt',
      },
    },
  },
  '/coaching-base-prompts/:id': {
    get: {
      controller: getCoachingBasePrompt,
      access: ['super-admin'],
      response: {
        $ref: '#/definitions/CoachingBasePrompt',
      },
      hookConfig: {
        resourceName: 'coachingBasePrompt',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateCoachingBasePrompt,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          content: {type: 'string'},
        },
      },
      response: {
        $ref: '#/definitions/CoachingBasePrompt',
      },
      hookConfig: {
        resourceName: 'coachingBasePrompt',
      },
    },
    delete: {
      controller: removeCoachingBasePrompt,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'coachingBasePrompt',
      },
    },
  },
};

export default coachingBasePromptController;
