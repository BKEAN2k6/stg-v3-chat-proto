import {type RouteConfigs} from '../../../types/routeconfig';
import {getGroup} from './getGroup';
import {updateGroup} from './updateGroup';

const groupController: RouteConfigs = {
  '/groups/:id': {
    get: {
      controller: getGroup,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
        },
        required: ['_id', 'name', 'description'],
      },
    },
    put: {
      controller: updateGroup,
      access: ['community-member', 'community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
        },
        required: ['name', 'description'],
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
        },
        required: ['_id', 'name', 'description'],
      },
    },
  },
};

export default groupController;
