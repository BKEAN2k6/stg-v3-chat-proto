import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getCommunities} from './getCommunities.js';
import {updateCommunity} from './updateCommunity.js';
import {createCommunity} from './createCommunity.js';
import {getCommunity} from './getCommunity.js';
import {createCommunityInvitation} from './createCommunityInvitation.js';
import {createCommunityUserImage} from './createCommunityUserImage.js';
import {upsertCommunityMember} from './upsertCommunityMember.js';
import {removeCommunityMember} from './removeCommunityMember.js';
import {getCommunityMembers} from './getCommunityMembers.js';
import {updateCommunityAvatar} from './updateCommunityAvatar.js';
import {createUserToCommunity} from './createUserToCommunity.js';
import {getCommunityStats} from './getCommunityStats.js';
import {getCommunityProxyPost} from './getCommunityProxyPost.js';
import {createCommunityMemberInvitation} from './createCommunityMemberInvitation.js';
import {getCommunityMemberInvitations} from './getCommunityMemberInvitations.js';
import {getCommunitySubscription} from './getCommunitySubscriotion.js';
import {updateCommunitySubscription} from './updateCommunitySubscription.js';
import {updateCommunityBillingGroup} from './updateCommunityBillingGroup.js';

const communityController: RouteConfigs = {
  '/communities': {
    get: {
      controller: getCommunities,
      access: ['super-admin'],
      query: {
        type: 'object',
        properties: {
          search: {type: 'string'},
          limit: {type: 'string'},
          skip: {type: 'string'},
          sort: {type: 'string'},
          status: {$ref: '#/definitions/SubscriptionStatus'},
          subscriptionEnds: {type: 'string'},
          statusValidUntilFrom: {type: 'string'},
          statusValidUntilTo: {type: 'string'},
        },
      },
      response: {
        type: 'array',
        items: {$ref: '#/definitions/Community'},
      },
      hookConfig: {
        resourceName: 'community',
        queryType: 'list',
      },
    },
    post: {
      controller: createCommunity,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 50},
          description: {type: 'string', minLength: 1, maxLength: 500},
          language: {$ref: '#/definitions/LanguageCode'},
          timezone: {type: 'string'},
        },
        required: ['name', 'description', 'language', 'timezone'],
      },
      response: {$ref: '#/definitions/Community'},
      hookConfig: {
        resourceName: 'community',
        keyParamName: 'id',
      },
    },
  },
  '/communities/:id/invitations': {
    post: {
      controller: createCommunityInvitation,
      access: ['community-admin', 'community-owner', 'super-admin'],
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          code: {type: 'string'},
          createdAt: {type: 'string'},
        },
        required: ['id', 'community', 'createdAt'],
      },
    },
  },
  '/communities/:id': {
    get: {
      controller: getCommunity,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {$ref: '#/definitions/Community'},
      hookConfig: {
        resourceName: 'community',
        queryType: 'detail',
        keyParamName: 'id',
      },
    },
    patch: {
      controller: updateCommunity,
      access: ['community-admin', 'community-owner', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', minLength: 1, maxLength: 50},
          description: {type: 'string', minLength: 1, maxLength: 500},
          language: {$ref: '#/definitions/LanguageCode'},
          avatar: {type: 'string'},
          timezone: {type: 'string'},
        },
      },
      response: {$ref: '#/definitions/Community'},
      hookConfig: {
        resourceName: 'community',
        keyParamName: 'id',
      },
    },
  },
  '/communities/:id/billing-group': {
    patch: {
      controller: updateCommunityBillingGroup,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          billingGroupId: {
            anyOf: [{type: 'string'}, {type: 'null'}],
          },
        },
        required: ['billingGroupId'],
      },
      response: {$ref: '#/definitions/Community'},
      hookConfig: {
        resourceName: 'community',
        keyParamName: 'id',
      },
    },
  },
  '/communities/:id/avatar': {
    post: {
      controller: updateCommunityAvatar,
      access: ['community-admin', 'community-owner', 'super-admin'],
      response: {
        type: 'object',
        properties: {
          avatar: {
            type: 'string',
          },
        },
        required: ['avatar'],
      },
    },
  },
  '/communities/:id/userimages': {
    post: {
      controller: createCommunityUserImage,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 120,
      },
      response: {$ref: '#/definitions/UserImage'},
    },
  },
  '/communities/:id/members/:userId': {
    put: {
      controller: upsertCommunityMember,
      access: ['community-owner', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          role: {type: 'string', enum: ['member', 'admin', 'owner']},
        },
        required: ['role'],
      },
    },
    delete: {
      controller: removeCommunityMember,
      access: ['community-admin', 'community-owner', 'super-admin'],
    },
  },
  '/communities/:id/members': {
    get: {
      controller: getCommunityMembers,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            avatar: {
              type: 'string',
            },
            language: {$ref: '#/definitions/LanguageCode'},
            role: {type: 'string', enum: ['member', 'admin', 'owner']},
          },
          required: [
            'id',
            'firstName',
            'lastName',
            'email',
            'language',
            'avatar',
            'role',
          ],
        },
      },
    },
  },
  '/communities/:id/users': {
    post: {
      controller: createUserToCommunity,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email', maxLength: 320},
          firstName: {type: 'string', minLength: 1, maxLength: 20},
          lastName: {type: 'string', minLength: 1, maxLength: 25},
          role: {type: 'string', enum: ['member', 'admin']},
          language: {$ref: '#/definitions/LanguageCode'},
          country: {type: 'string'},
          organization: {type: 'string'},
          organizationType: {type: 'string'},
          organizationRole: {type: 'string'},
        },
        required: [
          'email',
          'firstName',
          'lastName',
          'role',
          'language',
          'country',
          'organization',
          'organizationType',
          'organizationRole',
        ],
      },
      response: {
        type: 'object',
        properties: {
          code: {type: 'string'},
        },
        required: ['code'],
      },
    },
  },
  '/communities/:id/stats': {
    get: {
      controller: getCommunityStats,
      access: [
        'community-member',
        'community-admin',
        'community-owner',
        'super-admin',
      ],
      response: {$ref: '#/definitions/CommunityStats'},
    },
  },
  '/communities/:id/proxy-posts/:postId': {
    get: {
      controller: getCommunityProxyPost,
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
        ],
      },
    },
  },
  '/communities/:id/user-invitations': {
    post: {
      controller: createCommunityMemberInvitation,
      access: ['community-admin', 'community-owner', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email', maxLength: 320},
          message: {type: 'string', maxLength: 500},
        },
        required: ['email'],
      },
      response: {
        $ref: '#/definitions/CommunityMemberInvitation',
      },
    },
    get: {
      controller: getCommunityMemberInvitations,
      access: ['community-admin', 'community-owner', 'super-admin'],
      response: {
        type: 'array',
        items: {$ref: '#/definitions/CommunityMemberInvitation'},
      },
    },
  },
  '/communities/:id/subscription': {
    get: {
      controller: getCommunitySubscription,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          statusValidUntil: {type: 'string'},
          status: {$ref: '#/definitions/SubscriptionStatus'},
          subscriptionEnds: {type: 'boolean'},
          updatedAt: {type: 'string'},
          updatedBy: {$ref: '#/definitions/UserInfo'},
          history: {
            type: 'array',
            items: {$ref: '#/definitions/SubscriptionHistoryEntry'},
          },
        },
      },
    },
    post: {
      controller: updateCommunitySubscription,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          statusValidUntil: {type: 'string'},
          status: {$ref: '#/definitions/SubscriptionStatus'},
          subscriptionEnds: {type: 'boolean'},
        },
        required: ['statusValidUntil'],
      },
      response: {
        type: 'object',
        properties: {
          statusValidUntil: {type: 'string'},
          status: {$ref: '#/definitions/SubscriptionStatus'},
          subscriptionEnds: {type: 'boolean'},
          updatedAt: {type: 'string'},
          updatedBy: {$ref: '#/definitions/UserInfo'},
          history: {
            type: 'array',
            items: {$ref: '#/definitions/SubscriptionHistoryEntry'},
          },
        },
        required: ['statusValidUntil'],
      },
      hookConfig: {
        resourceName: 'community',
        keyParamName: 'id',
        invalidateOnly: true,
      },
    },
  },
};

export default communityController;
