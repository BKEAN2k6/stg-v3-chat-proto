import {type RouteConfigs} from '../../../types/routeconfig';
import {createPostComment} from './createPostComment';
import {createPostReaction} from './createPostReaction';
import {removePost} from './removePost';
import {getPost} from './getPost';

const postController: RouteConfigs = {
  '/posts/:id/comments': {
    post: {
      controller: createPostComment,
      access: ['community-member', 'community-admin', 'super-admin'],
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
  '/posts/:id/reactions': {
    post: {
      controller: createPostReaction,
      access: ['community-member', 'community-admin', 'super-admin'],
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
  '/posts/:id': {
    get: {
      controller: getPost,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {
        type: 'object',
        discriminator: {propertyName: 'postType'},
        required: ['postType'],
        oneOf: [
          {$ref: '#/definitions/Challenge'},
          {$ref: '#/definitions/Moment'},
          {$ref: '#/definitions/SprintResult'},
          {$ref: '#/definitions/CoachPost'},
        ],
      },
    },
    delete: {
      controller: removePost,
      access: ['super-admin', 'community-admin', 'post-owner'],
    },
  },
};

export default postController;
