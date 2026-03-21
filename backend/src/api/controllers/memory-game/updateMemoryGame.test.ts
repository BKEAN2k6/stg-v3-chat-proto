import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {MemoryGame} from '../../../models/index.js';
import routes from '../index.js';

const updateMemoryGame = applySchemas(routes['/memory-games/:id/host'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body,

    events: {
      emit: vi.fn(),
    },
  });

describe('updateMemoryGame', () => {
  describe('when memory game is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {isStarted: true});

      await updateMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Sprint not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when memory game is updated successfully', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const memoryGameId = new mongoose.Types.ObjectId();
      await MemoryGame.create({
        _id: memoryGameId,
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'testPlayer',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
        group: new mongoose.Types.ObjectId(),
        isStarted: false,
        isEnded: false,
        cards: [
          {
            _id: new mongoose.Types.ObjectId(),
            strength: 'love',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            strength: 'love',
          },
        ],
      });

      mocks = createMocks(memoryGameId, {isStarted: true, isEnded: true});

      await updateMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and the updated memory game data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        isEnded: true,
        currentPlayer: expect.any(String),
        cards: [
          {id: expect.any(String), strength: 'love'},
          {id: expect.any(String), strength: 'love'},
        ],
        foundPairs: [],
        currentlyRevealedCards: [],
        players: [
          {
            id: expect.any(String),
            nickname: 'testPlayer',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
        updatedAt: expect.any(String),
      });
    });
  });
});
