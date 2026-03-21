import {expect, describe, it, jest, beforeEach} from '@jest/globals';
import Redis from 'ioredis-mock';
import RedLock from 'redlock';
import {type Logger} from '../types/logger';
import Migrator from './migrator';

describe('Migrator', () => {
  let mockLogger: Logger;

  beforeEach(async () => {
    mockLogger = {log: jest.fn()};
    await new Redis().flushall();
  });

  it('acquires and releases the lock during migration', async () => {
    const unlockMock = jest.fn().mockReturnValueOnce(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    jest.spyOn(RedLock.prototype, 'acquire').mockResolvedValueOnce({
      unlock: unlockMock,
    } as any);
    const migrator = new Migrator(new Redis(), mockLogger);

    await migrator.migrate('test', async () => {
      jest.fn();
    });

    expect(RedLock.prototype.acquire).toHaveBeenCalledTimes(1);
    expect(unlockMock).toHaveBeenCalledTimes(1);
  });

  it('runs the migration when it has not been run before', async () => {
    const redis = new Redis();
    await redis.flushall();
    const migrator = new Migrator(redis, mockLogger);
    const migrationOperation = jest.fn();
    const migration = async () => {
      migrationOperation();
    };

    await migrator.migrate('test', migration);

    expect(migrationOperation).toHaveBeenCalledTimes(1);
  });

  it('does not run the migration when it has been run before', async () => {
    const redis = new Redis();
    await redis.flushall();
    jest.spyOn(redis, 'get').mockResolvedValueOnce('1');
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    const migrator = new Migrator(redis, mockLogger);
    const migrationOperation = jest.fn();
    const migration = async () => {
      migrationOperation();
    };

    await migrator.migrate('test', migration);

    expect(migrationOperation).not.toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith('Migration test already ran');
  });

  it('sets the migration to have been ran even if the opertation throws an error', async () => {
    const redis = new Redis();
    jest.spyOn(redis, 'set').mockResolvedValueOnce('1');
    const migrator = new Migrator(redis, mockLogger);
    try {
      await migrator.migrate('test', async () => {
        throw new Error('test');
      });
    } catch {}

    expect(redis.set).toHaveBeenCalledWith('migrations:test', '1');
  });

  it('releases the lock even when the migration throws an error', async () => {
    const unlockMock = jest.fn().mockReturnValueOnce(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    jest.spyOn(RedLock.prototype, 'acquire').mockResolvedValueOnce({
      unlock: unlockMock,
    } as any);
    const migrator = new Migrator(new Redis(), mockLogger);

    try {
      await migrator.migrate('test', async () => {
        throw new Error('test');
      });
    } catch {}

    expect(unlockMock).toHaveBeenCalledTimes(1);
  });
});
