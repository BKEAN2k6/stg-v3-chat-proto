import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createClientError} from './createClientError.js';

const errorReportController: RouteConfigs = {
  '/error-report': {
    post: {
      controller: createClientError,
      access: ['public'],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 100,
      },
      request: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              stack: {
                type: 'string',
              },
            },
          },
          environment: {
            type: 'object',
          },
        },
      },
    },
  },
};

export default errorReportController;
