import {type RouteConfigs} from '../../../types/routeconfig';
import {createClick} from './createClick';
import {getClicks} from './getClicks';
import {createPageView} from './createPageView';
import {getPageViews} from './getPageViews';
import {getDailyActiveUsers} from './getDailyActiveUsers';
import {getWeeklyActiveUsers} from './getWeeklyActiveUsers';
import {getMonthlyActiveUsers} from './getMonthlyActiveUsers';

const analyticController: RouteConfigs = {
  '/analytics/clicks': {
    get: {
      controller: getClicks,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          format: {
            enum: ['csv'],
          },
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            app: {type: 'string'},
            page: {type: 'string'},
            path: {type: 'string'},
            community: {type: 'string'},
            element: {type: 'string'},
            count: {type: 'number'},
            date: {type: 'string'},
          },
          required: [
            'app',
            'page',
            'path',
            'community',
            'element',
            'count',
            'date',
          ],
        },
      },
    },
    post: {
      controller: createClick,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          app: {type: 'string'},
          page: {type: 'string'},
          path: {type: 'string'},
          community: {type: 'string'},
          element: {type: 'string'},
        },
        required: ['app', 'page', 'path', 'community', 'element'],
      },
    },
  },
  '/analytics/page-views': {
    get: {
      controller: getPageViews,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          format: {
            enum: ['csv'],
          },
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            app: {type: 'string'},
            page: {type: 'string'},
            path: {type: 'string'},
            community: {type: 'string'},
            count: {type: 'number'},
            date: {type: 'string'},
          },
          required: ['app', 'page', 'path', 'community', 'count', 'date'],
        },
      },
    },
    post: {
      controller: createPageView,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          app: {type: 'string'},
          page: {type: 'string'},
          path: {type: 'string'},
          community: {type: 'string'},
        },
        required: ['app', 'page', 'path', 'community'],
      },
    },
  },
  '/analytics/daily-active-users': {
    get: {
      controller: getDailyActiveUsers,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          format: {
            enum: ['csv'],
          },
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            app: {type: 'string'},
            community: {type: 'string'},
            count: {type: 'number'},
            retention: {type: 'number'},
            communityUserCount: {type: 'number'},
            date: {type: 'string'},
          },
          required: [
            'app',
            'community',
            'count',
            'retention',
            'communityUserCount',
            'date',
          ],
        },
      },
    },
  },
  '/analytics/weekly-active-users': {
    get: {
      controller: getWeeklyActiveUsers,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          format: {
            enum: ['csv'],
          },
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            app: {type: 'string'},
            community: {type: 'string'},
            count: {type: 'number'},
            retention: {type: 'number'},
            communityUserCount: {type: 'number'},
            date: {type: 'string'},
          },
          required: [
            'app',
            'community',
            'count',
            'retention',
            'communityUserCount',
            'date',
          ],
        },
      },
    },
  },
  '/analytics/monthly-active-users': {
    get: {
      controller: getMonthlyActiveUsers,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          format: {
            enum: ['csv'],
          },
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            app: {type: 'string'},
            community: {type: 'string'},
            count: {type: 'number'},
            retention: {type: 'number'},
            communityUserCount: {type: 'number'},
            date: {type: 'string'},
          },
          required: [
            'app',
            'community',
            'count',
            'retention',
            'communityUserCount',
            'date',
          ],
        },
      },
    },
  },
};

export default analyticController;
