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

const getPlayerMemoryGame = applySchemas(
  routes['/memory-games/:id/player'].get,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  session?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    session,

    events: {
      emit: vi.fn(),
    },
  });

describe('getPlayerMemoryGame', () => {
  describe('when memory game is not found in session', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {});

      await getPlayerMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Memory game not found from session" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Memory game not found from session',
      });
    });
  });

  describe('when memory game is not found in the database', () => {
    let mocks: Mocks<Request, Response>;
    const memoryGameId = new mongoose.Types.ObjectId();

    beforeEach(async () => {
      const session = {
        groupGames: {
          [memoryGameId.toJSON()]: {
            playerId: new mongoose.Types.ObjectId().toJSON(),
          },
        },
      };

      mocks = createMocks(memoryGameId, session);

      await getPlayerMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "MemoryGame not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe('when player is not found in the memory game', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const memoryGameId = new mongoose.Types.ObjectId();
      await MemoryGame.create({
        _id: memoryGameId,
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'testPlayer',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
        currentPlayer: new mongoose.Types.ObjectId(),
        group: new mongoose.Types.ObjectId(),
      });

      const session = {
        groupGames: {
          [memoryGameId.toJSON()]: {
            playerId: new mongoose.Types.ObjectId().toJSON(),
          },
        },
      };

      mocks = createMocks(memoryGameId, session);

      await getPlayerMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Player not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Player not found',
      });
    });
  });

  describe('when player is found in the memory game', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const playerId = new mongoose.Types.ObjectId();
      const memoryGameId = new mongoose.Types.ObjectId();
      await MemoryGame.create({
        _id: memoryGameId,
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        players: [
          {
            _id: playerId,
            nickname: 'testPlayer',
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
            strength: 'courage',
          },
        ],
        currentlyRevealedCards: [],
        foundPairs: [],
        group: new mongoose.Types.ObjectId(),
        isCompleted: false,
        currentPlayer: playerId,
      });

      const session = {
        groupGames: {
          [memoryGameId.toJSON()]: {
            playerId: playerId.toJSON(),
          },
        },
      };

      mocks = createMocks(memoryGameId, session);

      await getPlayerMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and the memory game details with player info', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        player: {
          id: expect.any(String),
          nickname: 'testPlayer',
          color: 'blue',
          avatar: 'testAvatar',
        },
        players: [
          {
            id: expect.any(String),
            nickname: 'testPlayer',
            color: 'blue',
            avatar: 'testAvatar',
          },
        ],
        cards: [
          {id: expect.any(String), strength: 'love'},
          {id: expect.any(String), strength: 'courage'},
        ],
        currentlyRevealedCards: [],
        foundPairs: [],
        currentPlayer: expect.any(String),
        isEnded: false,
        updatedAt: expect.any(String),
      });
    });
  });
});
