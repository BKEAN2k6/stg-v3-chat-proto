import {type RouteConfigs} from '../../../types/routeconfig';
import {removeReaction} from './removeReaction';
import {updateReaction} from './updateReaction';

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
