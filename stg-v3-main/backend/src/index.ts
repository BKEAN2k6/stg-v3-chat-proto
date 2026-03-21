// Newrelic must be imported before all other modules for instrumentation to work
if (process.env.NODE_ENV === 'production') {
  await import('newrelic');
}

/* eslint-disable import-x/first */
import type {Server as HttpServer} from 'node:http';
import process from 'node:process';
import 'dotenv/config'; // eslint-disable-line import-x/no-unassigned-import
import mongoose from 'mongoose';
import {Redis} from 'ioredis';
import createApp from './app.js';
import runMigrations from './migrations/index.js';
/* eslint-enable import-x/first */

const logger = console;

const redisUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REDISCLOUD_URL
    : process.env.REDIS_URL;

const redisClient = new Redis(redisUrl);

redisClient.on('error', logger.log);

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  await runMigrations(redisClient, logger);
}

const port = process.env.PORT;
const server = createApp(logger, redisClient);

function setupGracefulShutdown(httpServer: HttpServer) {
  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.log(`Received ${signal}, starting graceful shutdown`);

    const closeServer = httpServer.listening
      ? new Promise<void>((resolve) => {
          httpServer.close((error) => {
            if (error) {
              logger.log('Error while closing HTTP server', error);
            }

            resolve();
          });
        })
      : Promise.resolve();

    const closeMongo = (async () => {
      try {
        await mongoose.disconnect();
      } catch (error: unknown) {
        logger.log('Error while disconnecting from MongoDB', error);
      }
    })();

    const closeRedis = (async () => {
      try {
        await redisClient.quit();
      } catch (error: unknown) {
        logger.log('Error while closing Redis connection', error);
      }
    })();

    await Promise.all([closeServer, closeMongo, closeRedis]);

    logger.log('Graceful shutdown complete');
  };

  for (const signal of signals) {
    process.once(signal, () => {
      void shutdown(signal);
    });
  }
}

setupGracefulShutdown(server);
await connect();
server.listen(port, () => {
  logger.log(`Server is running at http://localhost:${port}`);
});
