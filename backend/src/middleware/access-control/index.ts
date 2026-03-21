import {type Request, type Response, type NextFunction} from 'express';
import type {RouteConfig} from '../../types/routeconfig.js';
import AccessController from './AccessController.js';

class AccessControl {
  private readonly accessController: AccessController;

  constructor(routeConfig: RouteConfig) {
    this.accessController = new AccessController(routeConfig);
  }

  filterResponse = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const responseJson = response.json;
    const {accessController} = this;

    response.json = function (body): Response {
      try {
        return responseJson.call(
          response,
          accessController.filterRead(body, response.statusCode),
        );
      } catch (error) {
        request.error = error;
        response.status(500);
        return responseJson.call(response, {
          error: 'Failed to filter response',
        });
      }
    };

    response.unsafeJson = responseJson;

    next();
  };

  restrictQuery = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      this.accessController.restrictQuery(request.query);
      next();
    } catch (error: any) {
      request.error = error; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      response.status(400).json({error: 'Invalid query parameters'});
    }
  };

  restrictRequest = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      this.accessController.restrictPath(request.roles);
      next();
    } catch {
      response.status(403).json({
        error: `Role(s) ${request.roles.join(', ')} are not allowed to access the resource`,
      });
    }
  };

  restrictRequestJson = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const method = request.method.toLowerCase();
    if (method !== 'post' && method !== 'put' && method !== 'patch') {
      next();
      return;
    }

    try {
      this.accessController.restrictWrite(request.body);
      next();
    } catch (error: any) {
      request.error = error; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      response.status(403).json({error: 'Write access denied'});
    }
  };
}

export default AccessControl;
