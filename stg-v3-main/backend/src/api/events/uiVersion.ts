import {type EventConfig} from '../../types/routeconfig.js';

export const uiVersion: EventConfig = {
  path: '/ui-version',
  name: 'UiVersion',
  access: ['public'],
  events: {
    update: {
      type: 'string',
    },
  },
};
