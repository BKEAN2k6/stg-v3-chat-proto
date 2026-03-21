import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getBillingContacts} from './getBillingContacts.js';
import {createBillingContact} from './createBillingContact.js';
import {updateBillingContact} from './updateBillingContact.js';
import {removeBillingContact} from './removeBillingContact.js';

const billingContactController: RouteConfigs = {
  '/billing-contacts': {
    get: {
      controller: getBillingContacts,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          search: {type: 'string'},
          limit: {type: 'string'},
          sort: {type: 'string', enum: ['name', 'recent']},
        },
      },
      response: {
        type: 'array',
        items: {$ref: '#/definitions/BillingContact'},
      },
      hookConfig: {
        resourceName: 'billingContact',
        queryType: 'list',
      },
    },
    post: {
      controller: createBillingContact,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 120},
          email: {
            type: 'string',
            format: 'email',
            minLength: 3,
            maxLength: 320,
          },
          crmLink: {type: 'string', maxLength: 500},
          notes: {type: 'string', maxLength: 5000},
        },
        required: ['name', 'email'],
      },
      response: {$ref: '#/definitions/BillingContact'},
      hookConfig: {
        resourceName: 'billingContact',
      },
    },
  },
  '/billing-contacts/:id': {
    patch: {
      controller: updateBillingContact,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 120},
          email: {
            type: 'string',
            format: 'email',
            minLength: 3,
            maxLength: 320,
          },
          crmLink: {type: 'string', maxLength: 500},
          notes: {type: 'string', maxLength: 5000},
        },
      },
      response: {$ref: '#/definitions/BillingContact'},
      hookConfig: {
        resourceName: 'billingContact',
      },
    },
    delete: {
      controller: removeBillingContact,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'billingContact',
      },
    },
  },
};

export default billingContactController;
