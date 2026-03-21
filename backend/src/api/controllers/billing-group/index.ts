import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getBillingGroups} from './getBillingGroups.js';
import {createBillingGroup} from './createBillingGroup.js';
import {getBillingGroup} from './getBillingGroup.js';
import {updateBillingGroup} from './updateBillingGroup.js';
import {updateBillingGroupSubscription} from './updateBillingGroupSubscription.js';
import {removeBillingGroup} from './removeBillingGroup.js';

const billingGroupController: RouteConfigs = {
  '/billing-groups': {
    get: {
      controller: getBillingGroups,
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
        items: {$ref: '#/definitions/BillingGroup'},
      },
      hookConfig: {
        resourceName: 'billingGroup',
        queryType: 'list',
      },
    },
    post: {
      controller: createBillingGroup,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 120},
          billingContactId: {type: 'string'},
          notes: {type: 'string', maxLength: 5000},
        },
        required: ['name', 'billingContactId'],
      },
      response: {$ref: '#/definitions/BillingGroup'},
      hookConfig: {
        resourceName: 'billingGroup',
      },
    },
  },
  '/billing-groups/:id': {
    get: {
      controller: getBillingGroup,
      access: ['super-admin'],
      response: {$ref: '#/definitions/BillingGroup'},
      hookConfig: {
        resourceName: 'billingGroup',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    delete: {
      controller: removeBillingGroup,
      access: ['super-admin'],
      hookConfig: {
        resourceName: 'billingGroup',
      },
    },
    patch: {
      controller: updateBillingGroup,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 120},
          billingContactId: {type: 'string'},
          notes: {type: 'string', maxLength: 5000},
        },
      },
      response: {$ref: '#/definitions/BillingGroup'},
      hookConfig: {
        resourceName: 'billingGroup',
      },
    },
  },
  '/billing-groups/:id/subscription': {
    patch: {
      controller: updateBillingGroupSubscription,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          statusValidUntil: {type: 'string', format: 'date-time'},
          status: {$ref: '#/definitions/SubscriptionStatus'},
          communityIds: {
            type: 'array',
            items: {type: 'string'},
          },
        },
        required: ['statusValidUntil'],
      },
      response: {
        type: 'object',
        properties: {
          billingGroup: {$ref: '#/definitions/BillingGroup'},
          updatedCommunityIds: {
            type: 'array',
            items: {type: 'string'},
          },
        },
        required: ['billingGroup', 'updatedCommunityIds'],
      },
      hookConfig: {
        resourceName: 'billingGroup',
      },
    },
  },
};

export default billingGroupController;
