import {type RouteConfigs} from '../../../types/routeconfig';
import {createChallengeParticipation} from './createChallengeParticipation';

const challengeController: RouteConfigs = {
  '/challenges/:id/participations': {
    post: {
      controller: createChallengeParticipation,
      access: ['community-member', 'community-admin'],
      response: {$ref: '#/definitions/UserInfo'},
    },
  },
};

export default challengeController;
