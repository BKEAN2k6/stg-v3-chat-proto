import {type RouteConfigs} from '../../../types/routeconfig.js';
import {getUiVersion} from './getUiVersion.js';

const uiVersionController: RouteConfigs = {
  '/ui-version': {
    get: {
      controller: getUiVersion,
      access: ['public'],
      response: {
        type: 'string',
      },
    },
  },
};

export default uiVersionController;
