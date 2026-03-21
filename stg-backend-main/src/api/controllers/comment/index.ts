import {type RouteConfigs} from '../../../types/routeconfig';
import {updateComment} from './updateComment';
import {removeComment} from './removeComment';
import {createCommentReaction} from './createCommentReaction';
import {createCommentComment} from './createCommentComment';

const commentController: RouteConfigs = {
  '/comments/:id': {
    patch: {
      controller: updateComment,
      access: ['super-admin', 'community-admin', 'comment-owner'],
      request: {
        type: 'object',
        properties: {
          content: {type: 'string', maxLength: 5000},
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            maxItems: 5,
          },
        },
      },
      response: {$ref: '#/definitions/Comment'},
    },
    delete: {
      controller: removeComment,
      access: ['super-admin', 'community-admin', 'comment-owner'],
    },
  },
  '/comments/:id/reactions': {
    post: {
      controller: createCommentReaction,
      access: ['community-member', 'community-admin'],
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
  '/comments/:id/comments': {
    post: {
      controller: createCommentComment,
      access: ['community-member', 'community-admin'],
      request: {
        type: 'object',
        properties: {
          content: {type: 'string', maxLength: 5000},
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            maxItems: 5,
          },
        },
      },
      response: {$ref: '#/definitions/Comment'},
    },
  },
};

export default commentController;
