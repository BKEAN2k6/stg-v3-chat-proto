import {type Schema} from '../../../types/routeconfig.js';

export const AiGuidanceResponse: Schema = {
  type: 'object',
  properties: {
    title: {type: 'string'},
    suggestionText: {type: 'string'},
    activityType: {
      type: 'string',
      enum: ['lesson', 'game', 'goal'],
    },
    activityId: {type: 'string'},
    logId: {type: 'string'},
  },
  required: ['title', 'suggestionText', 'activityType', 'logId'],
};
