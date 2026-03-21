import {type RouteConfigs} from '../../../types/routeconfig.js';
import {removeCommunityMemberInvitation} from './removeCommunityMemberInvitation.js';

const communityMemberInvitationController: RouteConfigs = {
  '/member-invitations/:id': {
    delete: {
      controller: removeCommunityMemberInvitation,
      access: [
        'community-admin',
        'community-owner',
        'super-admin',
        'invited-user',
      ],
    },
  },
};

export default communityMemberInvitationController;
