import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Sprint} from '../../../models/index.js';
import routes from '../index.js';

const createSprintStrength = applySchemas(
  routes['/sprints/:id/strengths'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  sessionGroupGames?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      strength: 'carefulness',
      to: new mongoose.Types.ObjectId().toJSON(),
    },

    session: {
      user: {
        _id: new mongoose.Types.ObjectId(),
      },
      groupGames: sessionGroupGames,
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('createSprintStrength', () => {
  describe('when sprint is not found from session', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        group: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
      });
      mocks = createMocks(sprint._id);

      await createSprintStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found from session',
      });
    });
  });

  describe('when sprint is not found from the database', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const id = new mongoose.Types.ObjectId();
      mocks = createMocks(id, {
        [id.toJSON()]: {
          strength: {},
        },
      });

      await createSprintStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when sprint is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        group: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
      });
      mocks = createMocks(sprint._id, {
        [sprint._id.toJSON()]: {
          strength: {},
        },
      });

      await createSprintStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the player data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        strength: 'carefulness',
        to: expect.any(String),
      });
    });
  });
});
