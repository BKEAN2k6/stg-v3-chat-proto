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

const getMemoryGameWithCode = applySchemas(routes['/memory-games/:code'].get);

const createMocks = (code: string, session?: Record<string, unknown>) =>
  createMocksAsync({
    params: {
      code,
    },
    session,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('getMemoryGameWithCode', () => {
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
      mocks = createMocks('123456');

      await getMemoryGameWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "MemoryGame not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe('when memory game is found but player is not registered', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const memoryGameId = new mongoose.Types.ObjectId();
      const memeryGame = await MemoryGame.create({
        _id: memoryGameId,
        code: '123456',
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'testPlayer',
            color: 'blue',
          },
        ],
        community: new mongoose.Types.ObjectId(),
      });

      const session = {
        memoryGames: {
          [memoryGameId.toHexString()]: {
            memoryGamePlayerId: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      };

      mocks = createMocks(memeryGame.code, session);

      await getMemoryGameWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and isRegistered as false', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isRegistered: false,
      });
    });
  });

  describe('when memory game is found and player is registered', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const playerId = new mongoose.Types.ObjectId();
      const memoryGameId = new mongoose.Types.ObjectId();
      const memeryGame = await MemoryGame.create({
        _id: memoryGameId,
        code: '123456',
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: playerId,
            nickname: 'testPlayer',
            color: 'blue',
          },
        ],
        community: new mongoose.Types.ObjectId(),
      });

      const session = {
        memoryGames: {
          [memoryGameId.toHexString()]: {
            memoryGamePlayerId: playerId.toHexString(),
          },
        },
      };

      mocks = createMocks(memeryGame.code, session);

      await getMemoryGameWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and isRegistered as true', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isRegistered: true,
      });
    });
  });
});
