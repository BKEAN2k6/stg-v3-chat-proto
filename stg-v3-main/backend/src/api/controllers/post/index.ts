import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createPostComment} from './createPostComment.js';
import {createPostReaction} from './createPostReaction.js';
import {getCommunityPosts} from './getCommunityPosts.js';
import {createCommunityMoment} from './createCommunityMoment.js';
import {removePost} from './removePost.js';
import {getPost} from './getPost.js';

const postController: RouteConfigs = {
  '/communities/:id/moments': {
    post: {
      controller: createCommunityMoment,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
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
  '/communities/:id/posts': {
    get: {
      controller: getCommunityPosts,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      query: {
        type: 'object',
        properties: {
          startDate: {type: 'string'},
          limit: {type: 'string'},
        },
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          discriminator: {propertyName: 'postType'},
          required: ['postType'],
          oneOf: [
            {$ref: '#/definitions/Challenge'},
            {$ref: '#/definitions/Moment'},
            {$ref: '#/definitions/SprintResult'},
            {$ref: '#/definitions/CoachPost'},
            {$ref: '#/definitions/LessonCompleted'},
            {$ref: '#/definitions/OnboardingCompleted'},
            {$ref: '#/definitions/GoalCompleted'},
            {$ref: '#/definitions/StrengthCompleted'},
          ],
        },
      },
    },
  },
  '/posts/:id/comments': {
    post: {
      controller: createPostComment,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
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
  },
  '/posts/:id/reactions': {
    post: {
      controller: createPostReaction,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
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
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'object',
        discriminator: {propertyName: 'postType'},
        required: ['postType'],
        oneOf: [
          {$ref: '#/definitions/Challenge'},
          {$ref: '#/definitions/Moment'},
          {$ref: '#/definitions/SprintResult'},
          {$ref: '#/definitions/CoachPost'},
          {$ref: '#/definitions/LessonCompleted'},
          {$ref: '#/definitions/OnboardingCompleted'},
          {$ref: '#/definitions/GoalCompleted'},
          {$ref: '#/definitions/StrengthCompleted'},
        ],
      },
    },
    delete: {
      controller: removePost,
      access: [
        'super-admin',
        'community-admin',
        'community-owner',
        'post-owner',
      ],
    },
  },
};

export default postController;
