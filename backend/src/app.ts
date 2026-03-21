import {createServer} from 'node:http';
import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {type Redis} from 'ioredis';
import express, {
  type Express,
  Router as router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import {rateLimit, ipKeyGenerator} from 'express-rate-limit';
import {Server} from 'socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import mongoose from 'mongoose';
import RolesResolver from './middleware/roles/index.js';
import AccessControl from './middleware/access-control/index.js';
import routes from './api/controllers/index.js';
import type {Logger} from './types/logger.js';
import type {Method, RouteConfig} from './types/routeconfig.js';
import setUpPassport from './passport/index.js';
import seed from './devSeed.js';
import {CommunityStats} from './models/CommunityStats.js';
import {SocketManager} from './socket-manager/index.js';
import socketEvents from './api/events/index.js';
import uiVersion from './uiVersion.js';
import {RetentionsStats} from './api/controllers/retention/RetentionStats.js';
import {registerAnalytics} from './analytics/registerAnalytics.js';

function createApp(logger: Logger, redis: Redis) {
  const app: Express = express();
  app.use(
    express.json({
      strict: false,
      limit: '50Mb',
    }),
  );
  morgan.token('user-id', function (request: Request) {
    return request.user?.id ?? '-';
  });
  morgan.token('error', function (request: Request) {
    return request.error?.message; // eslint-disable-line @typescript-eslint/no-unsafe-return
  });
  morgan.token('redacted-referrer', function (request: Request) {
    const referrer = request.headers.referer ?? request.headers.referrer;
    if (!referrer) return undefined;

    const redactUrl = (urlString: string) => {
      try {
        const url = new URL(urlString);
        if (url.searchParams.has('token')) {
          url.searchParams.set('token', 'REMOVED');
          return url.toString();
        }

        return urlString;
      } catch {
        return urlString;
      }
    };

    if (Array.isArray(referrer)) {
      return referrer.map((url) => redactUrl(url)).join(', ');
    }

    return redactUrl(referrer);
  });
  const httpLogger = morgan((tokens, request, response) =>
    JSON.stringify({
      ip: tokens['remote-addr'](request, response),
      user: tokens['user-id'](request, response),
      method: tokens.method(request, response),
      url: tokens.url(request, response),
      status: tokens.status(request, response),
      contentLength: tokens.res(request, response, 'content-length'),
      referrer: tokens['redacted-referrer'](request, response),
      userAgent: tokens['user-agent'](request, response),
      responseTime: tokens['response-time'](request, response),
      error: tokens.error(request, response) ?? undefined,
    }),
  );
  const server = createServer(app);
  const io = new Server(server);
  const rolesResolver = new RolesResolver();
  const socketManager = new SocketManager(
    logger,
    rolesResolver,
    io,
    socketEvents,
  );
  const retentionStats = new RetentionsStats(redis);
  const communityStats = new CommunityStats(redis);

  setTimeout(() => {
    void socketManager.emit('/ui-version', 'update', uiVersion);
  }, 30_000);

  const apiRouter = router();
  const defaultRateLimit = {
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: 'Too many requests, please try again later'},
    keyGenerator(request: Request) {
      if (request.user?.id) {
        return request.user.id;
      }

      if (request.get('x-forwarded-for')) {
        return request.get('x-forwarded-for')!.split(',')[0];
      }

      return ipKeyGenerator(request.ip!);
    },
  };

  app.disable('x-powered-by');

  if (process.env.NODE_ENV !== 'test') {
    apiRouter.use(httpLogger);
  }

  if (process.env.NODE_ENV === 'production') {
    app.use((request, response, next) => {
      if (request.headers['x-forwarded-proto'] === 'https') {
        next();
      } else {
        response.redirect(`https://${request.headers.host}${request.url}`);
      }
    });
  }

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  registerAnalytics(app, httpLogger, logger);

  app.use(compression());

  setUpPassport(apiRouter, io, redis);

  app.use((request: Request, response: Response, next: NextFunction) => {
    request.events = socketManager;
    request.stats = communityStats;
    request.retentionStats = retentionStats;
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(express.raw({type: 'image/jpeg', limit: '30mb'}));
  app.use(express.raw({type: 'image/png', limit: '30mb'}));
  app.use(express.raw({type: 'application/pdf', limit: '30mb'}));
  app.use(express.raw({type: 'application/zip', limit: '200mb'}));

  apiRouter.use(helmet());
  apiRouter.use(express.json());

  apiRouter.use(
    async (request: Request, response: Response, next: NextFunction) => {
      if (
        request.path === '/ui-version' ||
        request.path.startsWith('/users/me') ||
        !request.user?.sequenceNumber
      ) {
        next();
        return;
      }

      try {
        await request.retentionStats.recordUserSeen(
          request.user.sequenceNumber,
          new Date(),
        );
      } catch (error) {
        logger.log(error);
      }

      next();
    },
  );

  for (const [path, config] of Object.entries(routes)) {
    for (const [method, routeConfig] of Object.entries(config) as Array<
      [Method, RouteConfig]
    >) {
      const accessControl = new AccessControl(routeConfig);

      apiRouter[method](
        path,
        rateLimit({
          ...defaultRateLimit,
          ...routeConfig.rateLimit,
        }),
        rolesResolver.getRolesMiddleware,
        accessControl.restrictQuery,
        accessControl.restrictRequest,
        accessControl.restrictRequestJson,
        accessControl.filterResponse,
        routeConfig.controller,
      );
    }
  }

  apiRouter.use(function (_, response) {
    response.status(404).json({error: 'Not found'});
  });

  app.use('/api/v1', apiRouter);

  if (process.env.NODE_ENV === 'development') {
    app.get('/seed', async (request: Request, response: Response) => {
      try {
        logger.log('Seeding database');
        await mongoose.connection.db?.dropDatabase();
        await seed(logger);
        response.send('Database seeded');
      } catch (error) {
        logger.log(error);
      }
    });
  }

  const dirname = path.dirname(fileURLToPath(import.meta.url));

  app.use(
    express.static(path.join(dirname, '../../frontend/dist'), {
      index: false,
      maxAge: '30d',
      setHeaders(response, path) {
        if (
          path.endsWith('.png') ||
          path.endsWith('.mp3') ||
          path.endsWith('.jpg') ||
          path.endsWith('.css') ||
          path.endsWith('.json') ||
          path.endsWith('.js')
        ) {
          response.setHeader(
            'Cache-Control',
            'public, max-age=2592000, immutable',
          );
        }
      },
    }),
  );

  app.get('*index', (request, response) => {
    response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    response.setHeader('Surrogate-Control', 'max-age=0');
    response.sendFile(
      path.resolve(dirname, '../../frontend/dist', 'index.html'),
    );
  });

  io.adapter(createAdapter(redis, redis.duplicate()));

  socketManager.handleConnections();

  return server;
}

export default createApp;
