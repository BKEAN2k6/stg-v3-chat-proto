import {type RouteConfigs} from '../../../types/routeconfig';
import {createUser} from './createUser';
import {getMe} from './getMe';
import {updateMe} from './updateMe';
import {getUser} from './getUser';
import {updateUser} from './updateUser';
import {updateMeAvatar} from './updateMeAvatar';
import {getUsers} from './getUsers';
import {getUserCommunities} from './getUserCommunities';
import {getMyNotifications} from './getMyNotifications';
import {updateMyNotificationsRead} from './updateMyNotificationsRead';
import {createMyCommunityJoin} from './createMyCommunityJoin';
import {updateMyEmail} from './updateMyEmail';

const userController: RouteConfigs = {
  '/users': {
    post: {
      controller: createUser,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          firstName: {type: 'string', maxLength: 20},
          lastName: {type: 'string', maxLength: 25},
          email: {type: 'string', format: 'email', maxLength: 320},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
        },
        required: ['firstName', 'lastName', 'email', 'language'],
      },
      response: {
        type: 'object',
        properties: {
          success: {type: 'boolean'},
        },
        required: ['success'],
      },
    },
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
            _id: {
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
            language: {type: 'string', enum: ['en', 'fi', 'sv']},
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
            '_id',
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
          _id: {
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
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
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
                _id: {type: 'string'},
                name: {type: 'string', maxLength: 50},
                avatar: {type: 'string'},
                role: {type: 'string', enum: ['admin', 'member']},
                memberCount: {type: 'number'},
              },
              required: ['_id', 'name', 'role', 'avatar', 'memberCount'],
            },
          },
          selectedCommunity: {
            type: 'string',
          },
        },
        required: [
          '_id',
          'firstName',
          'lastName',
          'avatar',
          'email',
          'language',
          'roles',
          'communities',
          'selectedCommunity',
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
            maxLength: 20,
          },
          lastName: {
            type: 'string',
            maxLength: 25,
          },
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          password: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
          avatar: {
            type: 'string',
          },
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
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          avatar: {
            type: 'string',
          },
        },
        required: [
          'selectedCommunity',
          'firstName',
          'lastName',
          'language',
          'avatar',
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
          _id: {
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
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
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
          '_id',
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
            maxLength: 20,
          },
          lastName: {
            type: 'string',
            maxLength: 25,
          },
          email: {
            type: 'string',
            format: 'email',
            maxLength: 320,
          },
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
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
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
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
            _id: {type: 'string'},
            name: {type: 'string', maxLength: 50},
            role: {type: 'string', enum: ['admin', 'member']},
          },
          required: ['_id', 'name', 'role'],
        },
      },
    },
  },
  '/users/me/avatar': {
    post: {
      controller: updateMeAvatar,
      access: ['authenticated'],
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
};

export default userController;
