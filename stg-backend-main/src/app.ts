import {createServer} from 'node:http';
import process from 'node:process';
import type Redis from 'ioredis';
import express, {
  type Express,
  Router as router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';
import {type RedisReply, RedisStore} from 'rate-limit-redis';
import {Server} from 'socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import mongoose from 'mongoose';
import RolesResolver from './middleware/roles';
import AccessControl from './middleware/access-control';
import routes from './api/controllers';
import type {Logger} from './types/logger';
import type {Method, RouteConfig} from './types/routeconfig';
import setUpPassport from './passport';
import seed from './devSeed';
import {CommunityStats} from './models/CommunityStats';
import {SocketManager} from './socket-manager';
import socketEvents from './api/events';

function createApp(logger: Logger, redis: Redis) {
  const app: Express = express();
  const server = createServer(app);
  const io = new Server(server);
  const rolesResolver = new RolesResolver(logger);
  const socketManager = new SocketManager(
    logger,
    rolesResolver,
    io,
    socketEvents,
  );

  const apiRouter = router();
  const rateLimitSettings =
    process.env.NODE_ENV === 'test'
      ? {
          limit: 1_000_000,
        }
      : {
          // 1000 requests per 15 minutes window
          windowMs: 15 * 60 * 1000,
          max: 1000,
          standardHeaders: true,
          legacyHeaders: false,
          store: new RedisStore({
            sendCommand: async (command, ...commandArguments: string[]) =>
              redis.call(command, ...commandArguments) as Promise<RedisReply>,
          }),
          keyGenerator(request: Request) {
            if (request.user?.id) {
              return request.user.id;
            }

            if (request.get('x-forwarded-for')) {
              return request.get('x-forwarded-for')!.split(',')[0];
            }

            return request.ip!;
          },
        };

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('tiny'));
  }

  setUpPassport(app, io, redis);

  app.use((request: Request, response: Response, next: NextFunction) => {
    request.events = socketManager;
    request.stats = new CommunityStats(redis);
    request.logger = logger;
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(express.raw({type: 'image/jpeg', limit: '30mb'}));
  app.use(express.raw({type: 'image/png', limit: '30mb'}));
  app.use(express.raw({type: 'application/pdf', limit: '30mb'}));

  apiRouter.use(rateLimit(rateLimitSettings));
  apiRouter.use(helmet());

  let count = 1;
  for (const [path, config] of Object.entries(routes)) {
    for (const [method, routeConfig] of Object.entries(config) as Array<
      [Method, RouteConfig]
    >) {
      logger.log(
        `${count++} Registering route ${method.toUpperCase()} ${path}`,
      );
      const accessControl = new AccessControl(routeConfig, logger);

      apiRouter[method](
        path,
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
        await mongoose.connection.db.dropDatabase();
        await seed(logger);
        response.send('Database seeded');
      } catch (error) {
        logger.log(error);
      }
    });
  }

  io.adapter(createAdapter(redis, redis.duplicate()));

  socketManager.handleConnections();

  return server;
}

export default createApp;
