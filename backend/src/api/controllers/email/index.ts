import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getEmails} from './getEmails.js';

const emailController: RouteConfigs = {
  '/emails': {
    get: {
      controller: getEmails,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          en: {type: 'array', items: {type: 'string'}},
          fi: {type: 'array', items: {type: 'string'}},
          sv: {type: 'array', items: {type: 'string'}},
        },
        required: ['en', 'fi', 'sv'],
      },
    },
  },
};

export default emailController;
