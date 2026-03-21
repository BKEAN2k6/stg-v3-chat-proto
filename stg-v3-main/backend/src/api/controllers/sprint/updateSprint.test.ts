import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Sprint, SprintResult} from '../../../models/index.js';
import routes from '../index.js';
import {createTestGroup} from '../../../test-utils/testDocuments.js';

const updateSprint = applySchemas(routes['/sprints/:id/host'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body,
    stats: {
      updateCommunityStrenghts: vi.fn(),
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('updateSprint', () => {
  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when isStarted and isEnded are false', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await createTestGroup();
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        group,
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        isStarted: false,
        isEnded: false,
      });
      mocks = createMocks(sprint._id, {});

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('the response does not contain a room count', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        isEnded: false,
        isCompleted: false,
        isCodeActive: true,
        expectedStrengthCount: 0,
        sharedStrengths: [],
        players: [],
        updatedAt: expect.any(String),
      });
    });
  });

  describe('when isEnded is set to true', () => {
    describe('and the sprint does not have any strengths given', () => {
      let mocks: Mocks<Request, Response>;

      beforeEach(async () => {
        vi.spyOn(SprintResult, 'create');
        const group = await createTestGroup();

        const sprint = await Sprint.create({
          group,
          createdBy: new mongoose.Types.ObjectId(),
          code: '123456',
          codeActiveUntil: new Date('2099-01-01'),
          isStarted: true,
          roomCount: 1,
          players: [
            {
              _id: new mongoose.Types.ObjectId(),
              nickname: 'test-nickname-1',
              color: 'test-color-1',
              avatar: 'test-avatar-1',
            },
          ],
        });
        mocks = createMocks(sprint._id, {
          isEnded: true,
        });

        await updateSprint(mocks.req, mocks.res);
        await mocks.result;
      });

      it('it does not create a new moment', async () => {
        expect(SprintResult.create).not.toHaveBeenCalled();
        expect(mocks.res.statusCode).toBe(200);
      });
    });
  });

  describe('and the sprint does has strengths given', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await createTestGroup();

      const sprint = await Sprint.create({
        group,
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        isStarted: true,
        roomCount: 1,
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'test-nickname-1',
            color: 'test-color-1',
            avatar: 'test-avatar-1',
          },
        ],
        sharedStrengths: [
          {
            from: new mongoose.Types.ObjectId(),
            to: new mongoose.Types.ObjectId(),
            strength: 'love',
          },
        ],
      });
      mocks = createMocks(sprint._id, {
        isEnded: true,
      });

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it creates a new moment', async () => {
      expect(mocks.res.statusCode).toBe(200);
    });
  });
});
