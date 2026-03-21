import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  Challenge,
  User,
  ChallengeParticipation,
} from '../../../models/index.js';
import routes from '../index.js';

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
      id: userId.toJSON(),
    },
    stats: {
      updateLeaderboard: vi.fn(),
      getCommunityStats: vi.fn(),
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('createChallengeParticipation', () => {
  describe('when challenge is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId().toJSON(),
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

      const user = await registerTestUser({});

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

      mocks = createMocks(challenge._id.toJSON(), user._id);

      await createChallengeParticipation(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        avatar: 'test-avatar.jpg',
      });
    });
  });

  describe('when reaction to the same comment exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany();

      const user = await registerTestUser({});

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
      mocks = createMocks(challenge._id.toJSON(), user._id);

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
