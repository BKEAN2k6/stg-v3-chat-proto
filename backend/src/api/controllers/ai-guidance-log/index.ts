import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getAiGuidanceLogs} from './getAiGuidanceLogs.js';
import {getAiGuidanceLogById} from './getAiGuidanceLogById.js';

const aiGuidanceLogController: RouteConfigs = {
  '/ai-guidance-logs': {
    get: {
      controller: getAiGuidanceLogs,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'aiGuidanceLog',
        queryType: 'list',
      },
      query: {
        type: 'object',
        properties: {
          communityId: {type: 'string'},
          groupId: {type: 'string'},
          skip: {type: 'string'},
          limit: {type: 'string'},
        },
        required: [],
      },
      response: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                title: {type: 'string'},
                suggestionText: {type: 'string'},
                createdAt: {type: 'string'},
                action: {type: 'string', enum: ['none', 'action', 'refresh']},
                ageGroup: {$ref: '#/definitions/AgeGroup'},
                language: {$ref: '#/definitions/LanguageCode'},
                promptTokens: {type: 'number'},
                completionTokens: {type: 'number'},
                totalTokens: {type: 'number'},
                user: {
                  type: 'object',
                  properties: {
                    id: {type: 'string'},
                    firstName: {type: 'string'},
                    lastName: {type: 'string'},
                  },
                  required: ['id', 'firstName', 'lastName'],
                },
                group: {
                  type: 'object',
                  properties: {
                    id: {type: 'string'},
                    name: {type: 'string'},
                  },
                  required: ['id', 'name'],
                },
                community: {
                  type: 'object',
                  properties: {
                    id: {type: 'string'},
                    name: {type: 'string'},
                  },
                  required: ['id', 'name'],
                },
              },
              required: [
                'id',
                'title',
                'suggestionText',
                'createdAt',
                'action',
                'ageGroup',
                'language',
                'promptTokens',
                'completionTokens',
                'totalTokens',
                'user',
                'group',
                'community',
              ],
            },
          },
          total: {type: 'number'},
          skip: {type: 'number'},
          limit: {type: 'number'},
        },
        required: ['items', 'total', 'skip', 'limit'],
      },
    },
  },
  '/ai-guidance-logs/:id': {
    get: {
      controller: getAiGuidanceLogById,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'aiGuidanceLog',
        queryType: 'detail',
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          title: {type: 'string'},
          suggestionText: {type: 'string'},
          createdAt: {type: 'string'},
          prompt: {type: 'string'},
          response: {type: 'string'},
          user: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              firstName: {type: 'string'},
              lastName: {type: 'string'},
            },
            required: ['id', 'firstName', 'lastName'],
          },
          group: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
            },
            required: ['id', 'name'],
          },
          community: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
            },
            required: ['id', 'name'],
          },
        },
        required: [
          'id',
          'title',
          'suggestionText',
          'createdAt',
          'prompt',
          'response',
          'user',
          'group',
          'community',
        ],
      },
    },
  },
};

export default aiGuidanceLogController;
