import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getUserRetention} from './getUserRetention.js';

const retentionController: RouteConfigs = {
  '/user-retention': {
    get: {
      controller: getUserRetention,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          allUsers: {
            $ref: '#/definitions/UserRetention',
          },
          existingUsers: {
            $ref: '#/definitions/UserRetention',
          },
          registeredUsers: {
            $ref: '#/definitions/UserRetention',
          },
          topUsers: {
            $ref: '#/definitions/TopUsers',
          },
          newUsers: {
            $ref: '#/definitions/NewUsers',
          },
        },
        required: [
          'allUsers',
          'existingUsers',
          'registeredUsers',
          'topUsers',
          'newUsers',
        ],
      },
    },
  },
};

export default retentionController;
