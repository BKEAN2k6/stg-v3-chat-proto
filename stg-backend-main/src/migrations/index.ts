import type Redis from 'ioredis';
import {type Logger} from '../types/logger';
import Migrator from './migrator';
import challengeTheme from './30112024ChallengeTheme';

const runMigrations = async (redis: Redis, logger: Logger) => {
  const migrator = new Migrator(redis, logger);

  try {
    /* 
    Example to mirgate a single organization: 
    await migrator.migrate('positive-organization', async () =>
      migrateOrganizations(['Positive Learning']),
    ); 
    */

    await migrator.migrate('30112024ChallengeTheme', async () =>
      challengeTheme(),
    );
  } catch (error) {
    logger.log(error);
  }
};

export default runMigrations;
