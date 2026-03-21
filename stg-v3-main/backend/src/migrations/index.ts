import {type Redis} from 'ioredis';
import {type Logger} from '../types/logger.js';
import Migrator from './migrator.js';

const runMigrations = async (redis: Redis, logger: Logger) => {
  const migrator = new Migrator(redis, logger);

  try {
    /* Example migration
    await migrator.migrate('positive-organization', async () =>
      migrateOrganizations(['Positive Learning']),
    ); 
    */

    await migrator.migrate('nop-placeholder', async () => {
      logger.log('Nop placeholder migration');
    });
  } catch (error) {
    logger.log(error);
  }
};

export default runMigrations;
