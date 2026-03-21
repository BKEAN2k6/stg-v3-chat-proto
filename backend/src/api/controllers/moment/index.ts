import {type RouteConfigs} from '../../../types/routeconfig.js';
import {updateMoment} from './updateMoment.js';

const momentController: RouteConfigs = {
  '/moments/:id': {
    patch: {
      controller: updateMoment,
      access: [
        'community-admin',
        'community-owner',
        'post-owner',
        'super-admin',
      ],
      request: {
        type: 'object',
        properties: {
          content: {type: 'string', maxLength: 5000},
          strengths: {
            type: 'array',
            items: {$ref: '#/definitions/StrengthSlug'},
            maxItems: 5,
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            maxItems: 5,
          },
        },
      },
      response: {$ref: '#/definitions/Moment'},
    },
  },
};

export default momentController;
