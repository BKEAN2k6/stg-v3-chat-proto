import {type RouteConfigs} from '../../../types/routeconfig.js';
import {removeReaction} from './removeReaction.js';
import {updateReaction} from './updateReaction.js';

const commentController: RouteConfigs = {
  '/reactions/:id': {
    delete: {
      controller: removeReaction,
      access: ['reaction-owner'],
    },
    patch: {
      controller: updateReaction,
      access: ['reaction-owner'],
      request: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: [
              'like',
              'compassion',
              'courage',
              'creativity',
              'humour',
              'love',
              'perseverance',
            ],
          },
        },
        required: ['type'],
      },
      response: {$ref: '#/definitions/Reaction'},
    },
  },
};

export default commentController;
