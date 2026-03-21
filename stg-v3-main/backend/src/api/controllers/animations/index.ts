import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createVoiceover} from './createVoiceover.js';
import {createAnimation} from './createAnimantion.js';
import {updateAnimation} from './updateAnimation.js';
import {getAnimation} from './getAnimation.js';
import {getAnimations} from './getAnimations.js';
import {removeAnimation} from './removeAnimation.js';

const animationAssetController: RouteConfigs = {
  '/animation-assets/voiceover': {
    post: {
      controller: createVoiceover,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            minLength: 1,
            maxLength: 1000,
          },
          language: {$ref: '#/definitions/LanguageCode'},
        },
        required: ['text', 'language'],
      },
    },
  },
  '/animations': {
    get: {
      controller: getAnimations,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            isChecked: {
              type: 'boolean',
            },
            languages: {
              type: 'array',
              items: {
                $ref: '#/definitions/LanguageCode',
              },
            },
            createdBy: {
              $ref: '#/definitions/UserInfo',
            },
            updatedBy: {
              $ref: '#/definitions/UserInfo',
            },
            updatedAt: {
              type: 'string',
            },
          },
          required: [
            'id',
            'name',
            'isChecked',
            'languages',
            'createdBy',
            'updatedBy',
            'updatedAt',
          ],
        },
      },
    },
    post: {
      controller: createAnimation,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          isChecked: {
            type: 'boolean',
          },
          animations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                data: {
                  $ref: '#/definitions/AnimationLottie',
                },
              },
              required: ['language', 'data'],
            },
          },
          assetSettings: {
            type: 'array',
            items: {
              oneOf: [
                {$ref: '#/definitions/AnimationImageAsset'},
                {$ref: '#/definitions/AnimationAudioAsset'},
              ],
            },
          },
          loop: {
            type: 'boolean',
          },
          segments: {
            type: 'array',
            items: {
              $ref: '#/definitions/AnimationSegment',
            },
          },
        },
        required: [
          'name',
          'isChecked',
          'animations',
          'assetSettings',
          'loop',
          'segments',
        ],
      },
      response: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      },
    },
  },
  '/animations/:id': {
    get: {
      controller: getAnimation,
      access: ['super-admin'],
      response: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          isChecked: {
            type: 'boolean',
          },
          languages: {
            type: 'array',
            items: {
              $ref: '#/definitions/LanguageCode',
            },
          },
          assetSettings: {
            type: 'array',
            items: {
              anyOf: [
                {$ref: '#/definitions/AnimationImageAsset'},
                {$ref: '#/definitions/AnimationAudioAsset'},
              ],
            },
          },
          loop: {
            type: 'boolean',
          },
          segments: {
            type: 'array',
            items: {
              $ref: '#/definitions/AnimationSegment',
            },
          },
        },
        required: [
          'id',
          'name',
          'isChecked',
          'languages',
          'assetSettings',
          'loop',
          'segments',
        ],
      },
    },
    patch: {
      controller: updateAnimation,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          isChecked: {
            type: 'boolean',
          },
          animations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                data: {
                  type: 'object',
                },
              },
              required: ['language', 'data'],
            },
          },
          assetSettings: {
            type: 'array',
            items: {
              oneOf: [
                {$ref: '#/definitions/AnimationImageAsset'},
                {$ref: '#/definitions/AnimationAudioAsset'},
              ],
            },
          },
          loop: {
            type: 'boolean',
          },
          segments: {
            type: 'array',
            items: {
              $ref: '#/definitions/AnimationSegment',
            },
          },
        },

        required: ['name', 'animations', 'assetSettings', 'segments'],
      },
      response: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'name'],
      },
    },
    delete: {
      controller: removeAnimation,
      access: ['super-admin'],
    },
  },
};

export default animationAssetController;
