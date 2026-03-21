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

const updateMemoryGame = applySchemas(routes['/memory-games/:id/host'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('updateMemoryGame', () => {
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
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'testPlayer',
            color: 'blue',
          },
        ],
        community: new mongoose.Types.ObjectId(),
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
        _id: expect.any(String),
        isStarted: true,
        isEnded: true,
        code: expect.any(String),
        currentPlayer: expect.any(String),
        cards: [
          {_id: expect.any(String), strength: 'love'},
          {_id: expect.any(String), strength: 'love'},
        ],
        foundPairs: [],
        currentlyRevealedCards: [],
        players: [
          {_id: expect.any(String), nickname: 'testPlayer', color: 'blue'},
        ],
      });
    });
  });
});
