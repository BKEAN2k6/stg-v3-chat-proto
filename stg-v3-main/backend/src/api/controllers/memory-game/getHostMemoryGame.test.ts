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

const getHostMemoryGame = applySchemas(routes['/memory-games/:id/host'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('getHostMemoryGame', () => {
  describe('when memory game is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getHostMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "MemoryGame not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe('when memory game is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const gameId = new mongoose.Types.ObjectId();
      await MemoryGame.create({
        _id: gameId,
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        createdBy: new mongoose.Types.ObjectId(),
        group: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'test',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
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
        currentlyRevealedCards: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        foundPairs: [
          {
            _id: new mongoose.Types.ObjectId(),
            player: new mongoose.Types.ObjectId(),
            card1: new mongoose.Types.ObjectId(),
            card2: new mongoose.Types.ObjectId(),
          },
        ],
      });

      mocks = createMocks(gameId);

      await getHostMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and the memory game data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        isEnded: false,
        isCodeActive: true,
        currentPlayer: expect.any(String),
        players: [
          {
            id: expect.any(String),
            nickname: 'test',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
        cards: [
          {id: expect.any(String), strength: 'love'},
          {id: expect.any(String), strength: 'love'},
        ],
        currentlyRevealedCards: [expect.any(String), expect.any(String)],
        foundPairs: [
          {
            player: expect.any(String),
            card1: expect.any(String),
            card2: expect.any(String),
          },
        ],
        updatedAt: expect.any(String),
      });
    });
  });
});
