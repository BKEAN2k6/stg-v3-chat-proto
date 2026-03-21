import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import Redis from 'ioredis-mock';
import {CommunityStats} from '../../../models/CommunityStats';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {User} from '../../../models';
import routes from '../index';

const createCommunityMood = applySchemas(routes['/communities/:id/moods'].post);

const createMocks = (userId: mongoose.Types.ObjectId, stats: CommunityStats) =>
  createMocksAsync({
    body: {
      mood: '2',
    },
    user: {
      id: userId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    stats,
  });

describe('createCommunityMood', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mongoose.connect(global.__MONGO_URI__, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dbName: global.__MONGO_DB_NAME__,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('when saving the mood succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();
      const stats = new CommunityStats(new Redis());
      jest.spyOn(stats, 'updateMoodMeter').mockResolvedValueOnce();
      jest.spyOn(stats, 'getMooodMeter').mockResolvedValueOnce([
        {mood: 1, count: 1},
        {mood: 2, count: 2},
        {mood: 3, count: 3},
        {mood: 4, count: 4},
        {mood: 5, count: 5},
      ]);

      const user = await User.create({
        email: 'test@test.com',
      });

      mocks = createMocks(user._id, stats);

      await createCommunityMood(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond the mood meter results', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual([
        {mood: 1, count: 1},
        {mood: 2, count: 2},
        {mood: 3, count: 3},
        {mood: 4, count: 4},
        {mood: 5, count: 5},
      ]);
    });
  });
});
