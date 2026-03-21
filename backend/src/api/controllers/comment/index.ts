import {type RouteConfigs} from '../../../types/routeconfig.js';
import {updateComment} from './updateComment.js';
import {removeComment} from './removeComment.js';
import {createCommentReaction} from './createCommentReaction.js';
import {createCommentComment} from './createCommentComment.js';

const commentController: RouteConfigs = {
  '/comments/:id': {
    patch: {
      controller: updateComment,
      access: [
        'super-admin',
        'community-admin',
        'community-owner',
        'comment-owner',
      ],
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
      access: ['community-member', 'community-admin', 'community-owner'],
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
      access: ['community-member', 'community-admin', 'community-owner'],
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
