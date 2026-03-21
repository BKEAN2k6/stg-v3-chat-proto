import process from 'node:process';
import {
  Router as router,
  type Express,
  type Request,
  type Response,
  type RequestHandler,
} from 'express';
import proxy from 'express-http-proxy';
import type {Logger} from '../types/logger.js';
import {fetchAnalyticsScript} from './fetchAnalyticsScript.js';

export const registerAnalytics = (
  app: Express,
  httpLogger: RequestHandler,
  logger: Logger,
) => {
  const analyticsRouter = router();

  analyticsRouter.use(httpLogger);
  analyticsRouter.get(
    '/script.js',
    async (request: Request, response: Response) => {
      try {
        const script = await fetchAnalyticsScript();

        if (script.contentType) {
          response.setHeader('Content-Type', script.contentType);
        }

        response.send(script.body);
      } catch (error) {
        logger.log(error);
        response
          .status(502)
          .json({error: 'Unable to load analytics script from upstream'});
      }
    },
  );
  analyticsRouter.use(proxy(process.env.UMAMI_HOST));

  app.use('/analytics', analyticsRouter);
};
