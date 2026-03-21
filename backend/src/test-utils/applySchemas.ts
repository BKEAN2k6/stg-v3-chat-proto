import {type Request, type Response, type NextFunction} from 'express';
import {type RouteConfig} from '../types/routeconfig.js';
import AccessControl from '../middleware/access-control/index.js';

export function applySchemas(routeConfig?: RouteConfig) {
  if (!routeConfig) {
    throw new Error('Route config is required');
  }

  const accessControl = new AccessControl(routeConfig);

  return async function (request: Request, response: Response) {
    accessControl.restrictQuery(request, response, () => {
      accessControl.restrictRequestJson(request, response, () => {
        accessControl.filterResponse(request, response, async () => {
          await routeConfig.controller(request, response, (() => {
            throw new Error('Controller should not call next function');
          }) as NextFunction);
        });
      });
    });
  };
}
