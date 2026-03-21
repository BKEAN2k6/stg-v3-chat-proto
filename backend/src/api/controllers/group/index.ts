import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCommunityGroups} from './getCommunityGroups.js';
import {createCommunityGroup} from './createCommunityGroup.js';
import {getGroup} from './getGroup.js';
import {updateGroup} from './updateGroup.js';
import {createGroupArticleProgress} from './createGroupArticleProgress.js';
import {removeGroupArticleProgress} from './removeGroupArticleProgress.js';
import {getAiGuidance} from './getAiGuidance.js';
import {updateGuidanceLog} from './updateGuidanceLog.js';
import {getGroupStats} from './getGroupStats.js';

const groupController: RouteConfigs = {
  '/communities/:id/groups': {
    get: {
      controller: getCommunityGroups,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'array',
        items: {
          $ref: '#/definitions/Group',
        },
      },
      hookConfig: {
        resourceName: 'group',
        queryType: 'list',
        keyParamName: 'id',
      },
    },
    post: {
      controller: createCommunityGroup,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 50},
          description: {type: 'string', minLength: 1, maxLength: 500},
          owner: {type: 'string'},
        },
        required: ['name', 'description', 'owner'],
      },
      response: {
        $ref: '#/definitions/Group',
      },
      hookConfig: {
        resourceName: 'group',
      },
    },
  },
  '/groups/:id': {
    get: {
      controller: getGroup,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        $ref: '#/definitions/Group',
      },
      hookConfig: {
        resourceName: 'group',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateGroup,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 50},
          description: {type: 'string', minLength: 1, maxLength: 500},
          owner: {type: 'string'},
          language: {$ref: '#/definitions/LanguageCode'},
          ageGroup: {$ref: '#/definitions/AgeGroup'},
        },
      },
      response: {
        $ref: '#/definitions/Group',
      },
      hookConfig: {
        resourceName: 'group',
      },
    },
  },
  '/groups/:id/article-progress': {
    post: {
      controller: createGroupArticleProgress,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          article: {type: 'string'},
          isSkipped: {type: 'boolean'},
        },
        required: ['article', 'isSkipped'],
      },
      response: {
        $ref: '#/definitions/ArticleProgressEntry',
      },
      hookConfig: {
        resourceName: 'group',
        subResourceName: 'articleProgress',
      },
    },
  },
  '/groups/:id/article-progress/:article': {
    delete: {
      controller: removeGroupArticleProgress,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
    },
  },
  '/groups/:id/guidance': {
    get: {
      controller: getAiGuidance,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 60,
      },
      query: {
        type: 'object',
        properties: {
          clientHour: {type: 'string', maxLength: 2},
          clientWeekday: {type: 'string', maxLength: 9},
        },
      },
      response: {
        $ref: '#/definitions/AiGuidanceResponse',
      },
      hookConfig: {
        resourceName: 'group',
        subResourceName: 'aiGuidance',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
  },
  '/groups/:id/stats': {
    get: {
      controller: getGroupStats,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        $ref: '#/definitions/GroupStats',
      },
      hookConfig: {
        resourceName: 'groupStats',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
  },
  '/groups/:id/guidance-logs/:logId': {
    patch: {
      controller: updateGuidanceLog,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          action: {type: 'string', enum: ['action', 'refresh']},
        },
      },
    },
  },
};

export default groupController;
