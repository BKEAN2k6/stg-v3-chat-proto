import {type RouteConfigs} from '../../../types/routeconfig.js';
import {login} from './login.js';
import {magicLogin} from './magicLogin.js';
import {emailAuth} from './emailAuth.js';
import {logout} from './logout.js';
import {codeAuth} from './codeAuth.js';
import {checkEmailExists} from './checkEmail.js';
import {confirmEmail} from './confirmEmail.js';
import {register} from './register.js';

const authController: RouteConfigs = {
  '/register': {
    post: {
      controller: register,
      access: ['public'],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 10,
      },
      request: {
        type: 'object',
        properties: {
          firstName: {type: 'string', minLength: 1, maxLength: 20},
          lastName: {type: 'string', minLength: 1, maxLength: 25},
          email: {type: 'string', format: 'email', maxLength: 320},
          language: {$ref: '#/definitions/LanguageCode'},
          country: {type: 'string'},
          organization: {type: 'string'},
          organizationType: {type: 'string'},
          organizationRole: {type: 'string'},
        },
        required: [
          'firstName',
          'lastName',
          'email',
          'language',
          'country',
          'organization',
          'organizationType',
          'organizationRole',
        ],
      },
    },
  },
  '/login': {
    post: {
      controller: login,
      access: ['public'],
      noAuthRedirect: true,
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 30,
      },
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email'},
          password: {type: 'string'},
          rememberMe: {type: 'boolean'},
          invitationCode: {type: 'string'},
        },
        required: ['email', 'password'],
      },
    },
    delete: {
      controller: logout,
      access: ['authenticated'],
    },
  },
  '/magiclogin': {
    post: {
      controller: magicLogin,
      access: ['public'],
      noAuthRedirect: true,
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 200,
      },
      request: {
        type: 'object',
        properties: {
          token: {type: 'string'},
        },
        required: ['token'],
      },
      response: {
        type: 'object',
        properties: {
          allowPasswordChange: {type: 'boolean'},
          forcePasswordChange: {type: 'boolean'},
        },
        required: ['allowPasswordChange', 'forcePasswordChange'],
      },
    },
  },
  '/emailauth': {
    post: {
      controller: emailAuth,
      access: ['public'],
      noAuthRedirect: true,
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 10,
      },
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email', maxLength: 320},
          resetPassword: {type: 'boolean'},
        },
        required: ['email'],
      },
    },
  },
  '/codeauth': {
    post: {
      controller: codeAuth,
      access: ['public'],
      noAuthRedirect: true,
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 200,
      },
      request: {
        type: 'object',
        properties: {
          invitationCode: {type: 'string'},
          email: {type: 'string', format: 'email', maxLength: 320},
          firstName: {type: 'string', minLength: 1, maxLength: 20},
          lastName: {type: 'string', minLength: 1, maxLength: 25},
          language: {$ref: '#/definitions/LanguageCode'},
          country: {type: 'string'},
          organization: {type: 'string'},
          organizationType: {type: 'string'},
          organizationRole: {type: 'string'},
          password: {type: 'string', minLength: 8},
        },
        required: [
          'invitationCode',
          'email',
          'firstName',
          'lastName',
          'country',
          'organization',
          'organizationType',
          'organizationRole',
          'language',
          'password',
        ],
      },
    },
  },
  '/check-email': {
    post: {
      controller: checkEmailExists,
      access: ['public'],
      noAuthRedirect: true,
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 60,
      },
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email'},
        },
        required: ['email'],
      },
      response: {
        type: 'object',
        properties: {
          exists: {type: 'boolean'},
        },
        required: ['exists'],
      },
    },
  },
  '/confirm-email': {
    post: {
      controller: confirmEmail,
      access: ['public'],
      request: {
        type: 'object',
        properties: {
          token: {type: 'string'},
        },
        required: ['token'],
      },
    },
  },
};

export default authController;
