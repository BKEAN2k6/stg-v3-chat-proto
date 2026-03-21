import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createChallengeParticipation} from './createChallengeParticipation.js';

const challengeController: RouteConfigs = {
  '/challenges/:id/participations': {
    post: {
      controller: createChallengeParticipation,
      access: ['community-member', 'community-admin', 'community-owner'],
      response: {$ref: '#/definitions/UserInfo'},
    },
  },
};

export default challengeController;
