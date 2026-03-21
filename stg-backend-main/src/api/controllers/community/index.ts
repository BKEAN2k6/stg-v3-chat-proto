import {type RouteConfigs} from '../../../types/routeconfig';
import {getCommunityGroups} from './getCommunityGroups';
import {getCommunityPosts} from './getCommunityPosts';
import {createCommunityGroup} from './createCommunityGroup';
import {getCommunities} from './getCommunities';
import {updateCommunity} from './updateCommunity';
import {createCommunity} from './createCommunity';
import {getCommunity} from './getCommunity';
import {createCommunityInvitation} from './createCommunityInvitation';
import {createCommunityUserImage} from './createCommunityUserImage';
import {createCommunityMoment} from './createCommunityMoment';
import {upsertCommunityMember} from './upsertCommunityMember';
import {removeCommunityMember} from './removeCommunityMember';
import {getCommunityMembers} from './getCommunityMembers';
import {updateCommunityAvatar} from './updateCommunityAvatar';
import {createUserToCommunity} from './createUserToCommunity';
import {getCommunityStats} from './getCommunityStats';
import {createCommunityMood} from './createCommunityMood';
import {createCommunitySprint} from './createCommunitySprint';
import {getCommunityProxyPost} from './getCommunityProxyPost';

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
        },
      },
      response: {
        type: 'array',
        items: {$ref: '#/definitions/Community'},
      },
    },
    post: {
      controller: createCommunity,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          timezone: {type: 'string'},
        },
        required: ['name', 'description', 'language', 'timezone'],
      },
      response: {$ref: '#/definitions/Community'},
    },
  },
  '/communities/:id/invitations': {
    post: {
      controller: createCommunityInvitation,
      access: ['community-member', 'community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {},
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          code: {type: 'string'},
          createdAt: {type: 'string'},
        },
        required: ['_id', 'community', 'createdAt'],
      },
    },
  },
  '/communities/:id': {
    get: {
      controller: getCommunity,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {$ref: '#/definitions/Community'},
    },
    patch: {
      controller: updateCommunity,
      access: ['community-member', 'community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          avatar: {type: 'string'},
          timezone: {type: 'string'},
        },
      },
      response: {$ref: '#/definitions/Community'},
    },
  },
  '/communities/:id/avatar': {
    post: {
      controller: updateCommunityAvatar,
      access: ['community-admin', 'super-admin'],
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
  '/communities/:id/groups': {
    get: {
      controller: getCommunityGroups,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {type: 'string'},
            name: {type: 'string', maxLength: 50},
            description: {type: 'string', maxLength: 500},
          },
          required: ['_id', 'name', 'description'],
        },
      },
    },
    post: {
      controller: createCommunityGroup,
      access: ['community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
        },
        required: ['name', 'description'],
      },
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          name: {type: 'string', maxLength: 50},
          description: {type: 'string', maxLength: 500},
        },
        required: ['_id', 'name', 'description'],
      },
    },
  },
  '/communities/:id/moments': {
    post: {
      controller: createCommunityMoment,
      access: ['community-member', 'community-admin', 'super-admin'],
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
      access: ['community-member', 'community-admin', 'super-admin'],
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
          ],
        },
      },
    },
  },
  '/communities/:id/userimages': {
    post: {
      controller: createCommunityUserImage,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {$ref: '#/definitions/UserImage'},
    },
  },
  '/communities/:id/members/:userId': {
    put: {
      controller: upsertCommunityMember,
      access: ['community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          role: {type: 'string', enum: ['member', 'admin']},
        },
        required: ['role'],
      },
    },
    delete: {
      controller: removeCommunityMember,
      access: ['community-admin', 'super-admin'],
    },
  },
  '/communities/:id/members': {
    get: {
      controller: getCommunityMembers,
      access: ['community-admin', 'super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {
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
            language: {type: 'string', enum: ['en', 'fi', 'sv']},
            role: {type: 'string', enum: ['member', 'admin']},
          },
          required: [
            '_id',
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
      access: ['community-admin', 'super-admin'],
      request: {
        type: 'object',
        properties: {
          destination: {type: 'string', format: 'email', maxLength: 320},
          firstName: {type: 'string', maxLength: 20},
          lastName: {type: 'string', maxLength: 25},
          role: {type: 'string', enum: ['member', 'admin']},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
        },
        required: ['destination', 'firstName', 'lastName', 'role', 'language'],
      },
    },
  },
  '/communities/:id/stats': {
    get: {
      controller: getCommunityStats,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {$ref: '#/definitions/CommunityStats'},
    },
  },
  '/communities/:id/moods': {
    post: {
      controller: createCommunityMood,
      access: ['community-member', 'community-admin'],
      request: {
        type: 'object',
        properties: {
          mood: {type: 'number', enum: [1, 2, 3, 4, 5]},
        },
        required: ['mood'],
      },
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            mood: {type: 'number'},
            count: {type: 'number'},
          },
          required: ['mood', 'count'],
        },
      },
    },
  },
  '/communities/:id/sprints': {
    post: {
      controller: createCommunitySprint,
      access: ['community-member', 'community-admin', 'super-admin'],
      response: {
        type: 'object',
        properties: {
          _id: {type: 'string'},
          code: {type: 'string'},
        },
        required: ['_id', 'code'],
      },
    },
  },
  '/communities/:id/proxy-posts/:postId': {
    get: {
      controller: getCommunityProxyPost,
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
  },
};

export default communityController;
