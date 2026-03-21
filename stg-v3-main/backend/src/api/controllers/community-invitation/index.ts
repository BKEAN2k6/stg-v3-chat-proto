import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCommunityInvitationWithCode} from './getCommunityInvitationWithCode.js';

const communityInvitationController: RouteConfigs = {
  '/community-invitations/:code': {
    get: {
      controller: getCommunityInvitationWithCode,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          name: {type: 'string'},
          avatar: {type: 'string'},
        },
        required: ['id', 'name', 'avatar'],
      },
    },
  },
};

export default communityInvitationController;
