import {type EventConfig} from '../../types/routeconfig.js';

export const communityPosts: EventConfig = {
  path: '/communities/:id/posts',
  name: 'CommunityPosts',
  access: [
    'community-member',
    'community-admin',
    'community-owner',
    'super-admin',
  ],
  events: {
    create: {
      type: 'object',
      discriminator: {propertyName: 'postType'},
      required: ['postType'],
      oneOf: [
        {$ref: '#/definitions/Challenge'},
        {$ref: '#/definitions/Moment'},
        {$ref: '#/definitions/SprintResult'},
      ],
    },
    update: {
      type: 'object',
      discriminator: {propertyName: 'postType'},
      required: ['postType'],
      oneOf: [
        {$ref: '#/definitions/Challenge'},
        {$ref: '#/definitions/Moment'},
        {$ref: '#/definitions/SprintResult'},
      ],
    },
    delete: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      required: ['id'],
    },
  },
};
