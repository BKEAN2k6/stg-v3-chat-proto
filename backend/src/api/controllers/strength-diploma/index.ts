import {type RouteConfigs} from '../../../types/routeconfig.js';
import {generateStrengthDiploma} from './generateStrengthDiploma.js';
import {generateGroupStrengthDiploma} from './generateGroupStrengthDiploma.js';

const strengthDiplomaController: RouteConfigs = {
  '/strength-diploma/download': {
    post: {
      controller: generateStrengthDiploma,
      access: ['public'],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 30,
      },
      request: {
        type: 'object',
        properties: {
          studentName: {type: 'string', maxLength: 2000},
          signatureName: {type: 'string', maxLength: 2000},
          date: {type: 'string', maxLength: 2000},
          selectedStrengths: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                slug: {$ref: '#/definitions/StrengthSlug'},
                title: {type: 'string'},
                color: {type: 'string'},
                borderColor: {type: 'string'},
              },
              required: ['slug', 'title', 'color', 'borderColor'],
            },
          },
          translations: {
            type: 'object',
            properties: {
              strengthDiploma: {type: 'string'},
              diplomaAwardedTo: {type: 'string'},
              forUsingStrengths: {type: 'string'},
              signature: {type: 'string'},
              date: {type: 'string'},
            },
            required: [
              'strengthDiploma',
              'diplomaAwardedTo',
              'forUsingStrengths',
              'signature',
              'date',
            ],
          },
          paperSize: {type: 'string', enum: ['A4', 'Letter']},
          dateFormat: {type: 'string', enum: ['DMY', 'MDY', 'YMD']},
        },
        required: [
          'studentName',
          'date',
          'selectedStrengths',
          'translations',
          'paperSize',
          'dateFormat',
        ],
      },
    },
  },
  '/groups/:id/strength-diploma/download': {
    post: {
      controller: generateGroupStrengthDiploma,
      access: ['community-member', 'community-admin', 'community-owner'],
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        max: 60,
      },
      request: {
        type: 'object',
        properties: {
          signerName: {type: 'string', maxLength: 2000},
          date: {type: 'string', format: 'date'},
          strength: {$ref: '#/definitions/StrengthSlug'},
          translations: {
            type: 'object',
            properties: {
              strengthDiploma: {type: 'string'},
              diplomaAwardedTo: {type: 'string'},
              forUsingStrengths: {type: 'string'},
              forCompletingStrength: {type: 'string'},
              signature: {type: 'string'},
              date: {type: 'string'},
              strengthTitle: {type: 'string'},
              diploma: {type: 'string'},
            },
            required: [
              'strengthDiploma',
              'diplomaAwardedTo',
              'forUsingStrengths',
              'forCompletingStrength',
              'signature',
              'date',
              'strengthTitle',
              'diploma',
            ],
          },
          paperSize: {type: 'string', enum: ['A4', 'Letter']},
          strengthColor: {type: 'string'},
          strengthBadgeColor: {type: 'string'},
        },
        required: [
          'signerName',
          'date',
          'strength',
          'translations',
          'paperSize',
          'strengthColor',
          'strengthBadgeColor',
        ],
      },
    },
  },
};

export default strengthDiplomaController;
