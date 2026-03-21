import {type RouteConfigs} from '../../../types/routeconfig.js';
import {createVideoProcessingJob} from './createVideoProcessingJob.js';
import {getVideoProcessingJobs} from './getVideoProsessingJobs.js';
import {updateVideoProcessingJob} from './updateVideoProcessingJob.js';
import {removeVideoProcessingJob} from './removeVideoProcessingJob.js';
import {videoProcessingJobCallback} from './videoProsessingJobCallback.js';

const videoProcessingJobController: RouteConfigs = {
  '/video-processing-jobs': {
    get: {
      controller: getVideoProcessingJobs,
      access: ['super-admin'],
      response: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            url: {type: 'string'},
            type: {enum: ['lottie', 'video']},
            source: {enum: ['file', 'drive']},
            status: {enum: ['pending', 'processing', 'completed', 'failed']},
            fileName: {type: 'string'},
            coverFrameTimestamp: {type: 'number'},
            createdAt: {type: 'string'},
            updatedAt: {type: 'string'},
            errorMessage: {type: 'string'},
          },
          required: [
            'id',
            'url',
            'type',
            'source',
            'status',
            'fileName',
            'coverFrameTimestamp',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
    post: {
      controller: createVideoProcessingJob,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          url: {type: 'string', minLength: 1},
          type: {enum: ['lottie', 'video']},
          source: {enum: ['file', 'drive']},
          fileName: {type: 'string'},
          loop: {type: 'boolean'},
          videoSegments: {
            type: 'array',
            items: {type: 'object'},
          },
          lottieSegments: {
            type: 'array',
            items: {type: 'object'},
          },
          coverFrameTimestamp: {type: 'number'},
        },
        required: ['url', 'type', 'source', 'fileName', 'loop'],
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          url: {type: 'string'},
          type: {enum: ['lottie', 'video']},
          source: {enum: ['file', 'drive']},
          status: {enum: ['pending', 'processing', 'completed', 'failed']},
          fileName: {type: 'string'},
          coverFrameTimestamp: {type: 'number'},
          createdAt: {type: 'string'},
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'url',
          'type',
          'source',
          'status',
          'fileName',
          'coverFrameTimestamp',
          'createdAt',
          'updatedAt',
        ],
      },
    },
  },

  '/video-processing-jobs/:id': {
    patch: {
      controller: updateVideoProcessingJob,
      access: ['super-admin'],
      request: {
        type: 'object',
        properties: {
          status: {enum: ['processing']},
          coverFrameTimestamp: {type: 'number'},
        },
        additionalProperties: false,
      },
      response: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          url: {type: 'string'},
          type: {enum: ['lottie', 'video']},
          source: {enum: ['file', 'drive']},
          status: {enum: ['pending', 'processing', 'completed', 'failed']},
          fileName: {type: 'string'},
          coverFrameTimestamp: {type: 'number'},
          createdAt: {type: 'string'},
          updatedAt: {type: 'string'},
        },
        required: [
          'id',
          'url',
          'type',
          'source',
          'status',
          'fileName',
          'coverFrameTimestamp',
          'createdAt',
          'updatedAt',
        ],
      },
    },
    delete: {
      controller: removeVideoProcessingJob,
      access: ['super-admin'],
    },
  },

  '/video-processing-jobs/callback/:id': {
    post: {
      controller: videoProcessingJobCallback,
      access: ['public'],
    },
  },
};

export default videoProcessingJobController;
