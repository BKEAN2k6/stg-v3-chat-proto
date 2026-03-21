/* eslint-disable import/first */
import 'dotenv/config'; // eslint-disable-line import/no-unassigned-import
import process from 'node:process'; // eslint-disable-line import/order

if (process.env.NODE_ENV === 'production') {
  require('newrelic'); // eslint-disable-line @typescript-eslint/no-require-imports, import/no-unassigned-import, unicorn/prefer-module
}

import mongoose from 'mongoose';
import Redis from 'ioredis';
import createApp from './app';
import runMigrations from './migrations';

const logger = console;
const redisClient = new Redis(process.env.REDIS_URI, {family: 6});

redisClient.on('error', logger.log);

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  await runMigrations(redisClient, logger);
}

// eslint-disable-next-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
connect();

const port = process.env.PORT;
const server = createApp(logger, redisClient);

server.listen(port, () => {
  logger.log(`Server is running at http://localhost:${port}`);
});
