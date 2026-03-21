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

const getHostMemoryGame = applySchemas(routes['/memory-games/:id/host'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('getHostMemoryGame', () => {
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
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'test',
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
        _id: expect.any(String),
        code: expect.any(String),
        isStarted: false,
        isEnded: false,
        players: [{_id: expect.any(String), nickname: 'test', color: 'blue'}],
        cards: [
          {_id: expect.any(String), strength: 'love'},
          {_id: expect.any(String), strength: 'love'},
        ],
        currentlyRevealedCards: [expect.any(String), expect.any(String)],
        foundPairs: [
          {
            player: expect.any(String),
            card1: expect.any(String),
            card2: expect.any(String),
          },
        ],
      });
    });
  });
});
