import {type Request, type Response, type NextFunction} from 'express';
import type {Logger} from '../../types/logger';
import type {RouteConfig} from '../../types/routeconfig';
import AccessController from './AccessController';

class AccessControl {
  private readonly accessController: AccessController;

  constructor(
    routeConfig: RouteConfig,
    private readonly logger: Logger,
  ) {
    this.accessController = new AccessController(routeConfig, logger);
  }

  filterResponse = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const responseJson = response.json;
    const accessController = this.accessController;
    const logger = this.logger;

    response.json = function (body): Response {
      try {
        return responseJson.call(response, accessController.filterRead(body));
      } catch (error) {
        logger.log(error);
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
      this.logger.log(error);
      response.status(400).json({error: error.message as string});
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
    } catch (error: any) {
      this.logger.log(error.message);
      response.status(403).json({error: error.message as string});
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
      this.logger.log(error);
      response.status(403).json({error: error.message as string});
    }
  };
}

export default AccessControl;
