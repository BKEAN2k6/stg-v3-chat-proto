import {type RouteConfigs} from '../../../types/routeconfig';
import {login} from './login';
import {magicLogin} from './magicLogin';
import {emailAuth} from './emailAuth';
import {logout} from './logout';
import {codeAuth} from './codeAuth';
import {checkEmailExists} from './checkEmail';
import {confirmEmail} from './confirmEmail';

const authController: RouteConfigs = {
  '/login': {
    post: {
      controller: login,
      access: ['public'],
      noAuthRedirect: true,
      request: {
        type: 'object',
        properties: {
          email: {type: 'string', format: 'email'},
          password: {type: 'string'},
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
        },
      },
    },
  },
  '/emailauth': {
    post: {
      controller: emailAuth,
      access: ['public'],
      noAuthRedirect: true,
      request: {
        type: 'object',
        properties: {
          destination: {type: 'string', format: 'email', maxLength: 320},
          firstName: {type: 'string', maxLength: 20},
          lastName: {type: 'string', maxLength: 25},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          invitationCode: {type: 'string'},
          isRegistration: {type: 'boolean'},
          resetPassword: {type: 'boolean'},
        },
        required: ['destination'],
      },
      response: {
        type: 'object',
        properties: {
          success: {type: 'boolean'},
          code: {type: 'string'},
        },
        required: ['success', 'code'],
      },
    },
  },
  '/codeauth': {
    post: {
      controller: codeAuth,
      access: ['public'],
      noAuthRedirect: true,
      request: {
        type: 'object',
        properties: {
          invitationCode: {type: 'string'},
          email: {type: 'string', format: 'email', maxLength: 320},
          firstName: {type: 'string', maxLength: 20},
          lastName: {type: 'string', maxLength: 25},
          language: {type: 'string', enum: ['en', 'fi', 'sv']},
          password: {type: 'string'},
        },
        required: [
          'invitationCode',
          'email',
          'firstName',
          'lastName',
          'password',
          'language',
        ],
      },
    },
  },
  '/check-email': {
    post: {
      controller: checkEmailExists,
      access: ['public'],
      noAuthRedirect: true,
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
