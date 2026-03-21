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

const getPlayerSprint = applySchemas(routes['/sprints/:id/player'].get);

const createMocks = (
  id: mongoose.Types.ObjectId,
  sessionSprints?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },

    session: {
      groupGames: sessionSprints,
    },
    socketio: {
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
    },
  });

describe('getPlayerSprint', () => {
  describe('when sprint is not found from session', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getPlayerSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found from session',
      });
    });
  });

  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const id = new mongoose.Types.ObjectId();
      mocks = createMocks(id, {
        [id.toJSON()]: {
          strength: {},
        },
      });

      await getPlayerSprint(mocks.req, mocks.res);
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
    const player1 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-1',
      color: 'test-color-1',
      avatar: 'test-avatar-1',
    };
    const player2 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-2',
      color: 'test-color-2',
      avatar: 'test-avatar-2',
    };
    const player3 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-3',
      color: 'test-color-3',
      avatar: 'test-avatar-3',
    };

    beforeEach(async () => {
      const sprint = await Sprint.create({
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        isStarted: true,
        roomCount: 1,
        players: [player1, player2, player3],
        sharedStrengths: [
          {
            from: player1._id,
            to: player2._id,
            strength: 'creativity',
          },
          {
            from: player2._id,
            to: player1._id,
            strength: 'leadership',
          },
        ],
      });

      mocks = createMocks(sprint._id, {
        [sprint._id.toJSON()]: {
          playerId: sprint.players[0]._id,
        },
      });

      await getPlayerSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        player: {
          id: player1._id.toJSON(),
          nickname: 'test-nickname-1',
          color: 'test-color-1',
          avatar: 'test-avatar-1',
        },
        room: [
          {
            id: player2._id.toJSON(),
            nickname: 'test-nickname-2',
            avatar: 'test-avatar-2',
            color: 'test-color-2',
            strength: 'creativity',
          },
          {
            id: player3._id.toJSON(),
            nickname: 'test-nickname-3',
            avatar: 'test-avatar-3',
            color: 'test-color-3',
          },
        ],
        players: [
          player1._id.toJSON(),
          player2._id.toJSON(),
          player3._id.toJSON(),
        ],
        receivedStrengths: [
          {
            strength: 'leadership',
            from: {
              nickname: 'test-nickname-2',
              id: player2._id.toJSON(),
            },
          },
        ],
        isEnded: false,
        isCompleted: false,
        updatedAt: expect.any(String),
      });
    });
  });
});
