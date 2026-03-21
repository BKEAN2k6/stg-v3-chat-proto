import {
  jest,
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {MemoryGame} from '../../../models';
import routes from '../index';

const getPlayerMemoryGame = applySchemas(
  routes['/memory-games/:id/player'].get,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  session?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    session,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('getPlayerMemoryGame', () => {
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
        memoryGames: {
          [memoryGameId.toHexString()]: {
            memoryGamePlayerId: new mongoose.Types.ObjectId().toHexString(),
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
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'testPlayer',
            color: 'blue',
          },
        ],
        currentPlayer: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });

      const session = {
        memoryGames: {
          [memoryGameId.toHexString()]: {
            memoryGamePlayerId: new mongoose.Types.ObjectId().toHexString(),
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
        players: [
          {
            _id: playerId,
            nickname: 'testPlayer',
            color: 'blue',
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
        community: new mongoose.Types.ObjectId(),
        isCompleted: false,
        currentPlayer: playerId,
      });

      const session = {
        memoryGames: {
          [memoryGameId.toHexString()]: {
            memoryGamePlayerId: playerId.toHexString(),
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
        _id: expect.any(String),
        player: {
          _id: expect.any(String),
          nickname: 'testPlayer',
          color: 'blue',
        },
        players: [
          {
            _id: expect.any(String),
            nickname: 'testPlayer',
            color: 'blue',
          },
        ],
        cards: [
          {_id: expect.any(String), strength: 'love'},
          {_id: expect.any(String), strength: 'courage'},
        ],
        currentlyRevealedCards: [],
        foundPairs: [],
        currentPlayer: expect.any(String),
        isStarted: false,
        isEnded: false,
      });
    });
  });
});
