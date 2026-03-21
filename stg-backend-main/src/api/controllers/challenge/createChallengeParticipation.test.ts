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
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {Challenge, User, ChallengeParticipation} from '../../../models';
import routes from '../index';

const createChallengeParticipation = applySchemas(
  routes['/challenges/:id/participations'].post,
);

const createMocks = (challengeId: string, userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {},
    params: {
      id: challengeId,
    },
    user: {
      id: userId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    stats: {
      updateLeaderboard: jest.fn(),
      getCommunityStats: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createChallengeParticipation', () => {
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

  describe('when challenge is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId(),
      );

      await createChallengeParticipation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Challenge not found',
      });
    });
  });

  describe('when challenge is found and creating a participation succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

      const challenge = await Challenge.create({
        translations: {
          en: 'Test challenge',
          fi: 'Testi haaste',
          sv: 'Test utmaning',
        },
        theme: 'default',
        showDate: new Date(),
        strength: 'love',
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(challenge._id.toHexString(), user._id);

      await createChallengeParticipation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });
    });
  });

  describe('when reaction to the same comment exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

      const challenge = await Challenge.create({
        translations: {
          en: 'Test challenge',
          fi: 'Testi haaste',
          sv: 'Test utmaning',
        },
        theme: 'default',
        showDate: new Date(),
        strength: 'love',
        community: new mongoose.Types.ObjectId(),
      });

      await ChallengeParticipation.create({
        challenge,
        user,
      });
      mocks = createMocks(challenge._id.toHexString(), user._id);

      await createChallengeParticipation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with an error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Challenge participation to the same challenge exists already',
      });
    });
  });
});
