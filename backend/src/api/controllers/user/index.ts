import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getMe} from './getMe.js';
import {updateMe} from './updateMe.js';
import {getUser} from './getUser.js';
import {updateUser} from './updateUser.js';
import {updateMeAvatar} from './updateMeAvatar.js';
import {getUsers} from './getUsers.js';
import {getUserCommunities} from './getUserCommunities.js';
import {getMyNotifications} from './getMyNotifications.js';
import {updateMyNotificationsRead} from './updateMyNotificationsRead.js';
import {createMyCommunityJoin} from './createMyCommunityJoin.js';
import {updateMyEmail} from './updateMyEmail.js';
import {getMyCommunityInvitations} from './getMyCommunityInvitations.js';
import {updateMyCommunityInvitation} from './updateMyCommunityInvitation.js';
import {getUsersListCsv} from './getUsersListCsv.js';
import {getMyLastActiveGroups} from './getMyLastActiveGroups.js';
import {updateMyLastActiveGroups} from './updateMyLastActiveGroups.js';

const userController: RouteConfigs = {
  '/users': {
    get: {
      controller: getUsers,
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
            avatar: {
              type: 'string',
            },
            email: {type: 'string', format: 'email'},
            language: {$ref: '#/definitions/LanguageCode'},
            isEmailVerified: {
              type: 'boolean',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['super-admin'],
              },
            },
          },
          required: [
            'id',
            'firstName',
            'lastName',
            'avatar',
            'language',
            'email',
            'isEmailVerified',
            'roles',
          ],
        },
      },
    },
  },
  '/users/me': {
    get: {
      controller: getMe,
      access: ['authenticated'],
      response: {
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
          avatar: {
            type: 'string',
          },
          email: {type: 'string', format: 'email'},
          language: {$ref: '#/definitions/LanguageCode'},
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['super-admin'],
            },
          },
          communities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                avatar: {type: 'string'},
                role: {type: 'string', enum: ['member', 'admin', 'owner']},
                memberCount: {type: 'number'},
              },
              required: ['id', 'name', 'role', 'avatar', 'memberCount'],
            },
          },
          selectedCommunity: {
            type: 'string',
          },
          consents: {
            type: 'object',
            properties: {
              vimeo: {type: 'boolean'},
            },
            required: ['vimeo'],
          },
          hasSetConsents: {
            type: 'boolean',
          },
          introSlidesRead: {type: 'string'},
        },
        required: [
          'id',
          'firstName',
          'lastName',
          'avatar',
          'email',
          'language',
          'roles',
          'communities',
          'selectedCommunity',
          'consents',
          'hasSetConsents',
        ],
      },
    },
    patch: {
      controller: updateMe,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          selectedCommunity: {
            type: 'string',
          },
          firstName: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
          },
          lastName: {
            type: 'string',
            minLength: 1,
            maxLength: 25,
          },
          language: {$ref: '#/definitions/LanguageCode'},
          password: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
          avatar: {
            type: 'string',
          },
          consents: {
            type: 'object',
            properties: {
              vimeo: {type: 'boolean'},
            },
            required: ['vimeo'],
          },
          hasSetConsents: {
            type: 'boolean',
          },
          introSlidesRead: {type: 'string'},
        },
      },
      response: {
        type: 'object',
        properties: {
          selectedCommunity: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          language: {$ref: '#/definitions/LanguageCode'},
          avatar: {
            type: 'string',
          },
          consents: {
            type: 'object',
            properties: {
              vimeo: {type: 'boolean'},
            },
            required: ['vimeo'],
          },
          hasSetConsents: {
            type: 'boolean',
          },
          introSlidesRead: {type: 'string'},
        },
        required: [
          'selectedCommunity',
          'firstName',
          'lastName',
          'language',
          'avatar',
          'consents',
          'hasSetConsents',
        ],
      },
    },
  },
  '/users/me/email': {
    put: {
      controller: updateMyEmail,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email', maxLength: 320},
          password: {type: 'string'},
        },
        required: ['email', 'password'],
      },
      response: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
      },
    },
  },
  '/users/:id': {
    get: {
      controller: getUser,
      access: ['super-admin'],
      response: {
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
          avatar: {
            type: 'string',
          },
          email: {type: 'string', format: 'email'},
          language: {$ref: '#/definitions/LanguageCode'},
          isEmailVerified: {
            type: 'boolean',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['super-admin'],
            },
          },
        },
        required: [
          'id',
          'firstName',
          'lastName',
          'avatar',
          'email',
          'language',
          'isEmailVerified',
          'roles',
        ],
      },
    },
    patch: {
      controller: updateUser,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
          },
          lastName: {
            type: 'string',
            minLength: 1,
            maxLength: 25,
          },
          email: {
            type: 'string',
            format: 'email',
            maxLength: 320,
          },
          language: {$ref: '#/definitions/LanguageCode'},
          isEmailVerified: {
            type: 'boolean',
          },
          password: {
            type: 'string',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['super-admin'],
            },
          },
        },
      },
      response: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          language: {$ref: '#/definitions/LanguageCode'},
          isEmailVerified: {
            type: 'boolean',
          },
          roles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['super-admin'],
            },
          },
        },
        required: [
          'firstName',
          'lastName',
          'email',
          'language',
          'isEmailVerified',
          'roles',
        ],
      },
    },
  },
  '/users/:id/communities': {
    get: {
      controller: getUserCommunities,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            role: {type: 'string', enum: ['member', 'admin', 'owner']},
          },
          required: ['id', 'name', 'role'],
        },
      },
    },
  },
  '/users/me/avatar': {
    post: {
      controller: updateMeAvatar,
      access: ['authenticated'],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 20,
      },
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
  '/users/me/notifications': {
    get: {
      controller: getMyNotifications,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          discriminator: {propertyName: 'notificationType'},
          required: ['notificationType'],
          oneOf: [
            {$ref: '#/definitions/CommentReactionNotification'},
            {$ref: '#/definitions/CommentCommentNotification'},
            {$ref: '#/definitions/PostCommentNotification'},
            {$ref: '#/definitions/PostReactionNotification'},
            {$ref: '#/definitions/CommunityInvitationNotification'},
          ],
        },
      },
    },
  },
  '/users/me/notifications/read': {
    put: {
      controller: updateMyNotificationsRead,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          date: {type: 'string'},
        },
        required: ['date'],
      },
    },
  },
  '/users/me/community-join': {
    post: {
      controller: createMyCommunityJoin,
      access: ['authenticated'],
      request: {
        type: 'object',
        properties: {
          code: {type: 'string'},
        },
        required: ['code'],
      },
    },
  },
  '/users/me/community-invitations': {
    get: {
      controller: getMyCommunityInvitations,
      access: ['authenticated'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            community: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
              },
              required: ['id', 'name'],
            },
            message: {type: 'string'},
            cretedAt: {type: 'string'},
            createdBy: {
              $ref: '#/definitions/UserInfo',
            },
          },
          required: ['id', 'community', 'message', 'createdAt', 'createdBy'],
        },
      },
    },
  },
  '/users/me/community-invitations/:id': {
    patch: {
      controller: updateMyCommunityInvitation,
      access: ['invited-user'],
      request: {
        type: 'object',
        properties: {
          status: {type: 'string', enum: ['accepted']},
        },
        required: ['status'],
      },
    },
  },
  '/users/me/last-active-groups': {
    get: {
      controller: getMyLastActiveGroups,
      access: ['authenticated'],
      response: {
        type: 'object',
        patternProperties: {
          '^.*$': {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
      hookConfig: {
        resourceName: 'lastActiveGroups',
        queryType: 'list',
      },
    },
  },
  '/users/me/last-active-groups/:id': {
    patch: {
      controller: updateMyLastActiveGroups,
      access: ['authenticated'],
      request: {
        type: 'string',
      },
      response: {
        type: 'object',
        patternProperties: {
          '^.*$': {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
      hookConfig: {
        resourceName: 'lastActiveGroups',
        queryType: 'list',
      },
    },
  },
  '/users-csv': {
    get: {
      controller: getUsersListCsv,
      access: ['super-admin'],
    },
  },
};

export default userController;
