import {type EventConfig} from '../../types/routeconfig.js';

export const communityStats: EventConfig = {
  path: '/communities/:id/stats',
  name: 'CommunityStats',
  access: [
    'community-member',
    'community-admin',
    'community-owner',
    'super-admin',
  ],
  events: {
    update: {
      // The allOf is needed because of bug in using $ref at top level
      // See: https://github.com/bcherny/json-schema-to-typescript/issues/132
      allOf: [{$ref: '#/definitions/CommunityStats'}],
    },
  },
};
