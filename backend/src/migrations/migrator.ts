import RedLock from 'redlock';
import {type Redis} from 'ioredis';
import {type Logger} from '../types/logger.js';

export default class Migrator {
  private readonly lock: RedLock;

  constructor(
    private readonly redis: Redis,
    private readonly logger: Logger,
  ) {
    // @ts-expect-error outdated types in @types/redlock
    this.lock = new RedLock([this.redis]);
  }

  async migrate(name: string, migration: () => Promise<void>): Promise<void> {
    const migrationLock = await this.lock.acquire(
      `migrations-lock`,
      1000 * 60 * 10,
    );
    try {
      const migrated = await this.redis.get(`migrations:${name}`);
      if (migrated) {
        this.logger.log(`Migration ${name} already ran`);
        return;
      }

      await this.redis.set(`migrations:${name}`, '1');
      await migration();
    } finally {
      await migrationLock.unlock();
    }
  }
}
