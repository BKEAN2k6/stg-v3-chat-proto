import {type RouteConfigs} from '../../../types/routeconfig';
import {getCommunityInvitationWithCode} from './getCommunityInvitationWithCode';

const communityInvitationController: RouteConfigs = {
  '/community-invitations/:code': {
    get: {
      controller: getCommunityInvitationWithCode,
      access: ['public'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          name: {type: 'string'},
          avatar: {type: 'string'},
        },
        required: ['_id', 'name', 'avatar'],
      },
    },
  },
};

export default communityInvitationController;
