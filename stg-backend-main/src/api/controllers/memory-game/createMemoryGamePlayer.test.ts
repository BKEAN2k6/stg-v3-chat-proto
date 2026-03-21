import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
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

const createMemoryGamePlayer = applySchemas(
  routes['/memory-games/:id/players'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  session?: Record<string, unknown>,
  body?: Record<string, unknown>,
  user?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body,
    session,
    user,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createMemoryGamePlayer', () => {
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

  describe('when player already exists in session', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const gameId = new mongoose.Types.ObjectId();
      mocks = createMocks(
        gameId,
        {
          memoryGames: {
            [gameId.toHexString()]: {memoryGamePlayerId: 'existingPlayerId'},
          },
        },
        {nickname: 'test', color: 'blue'},
        {id: 'testUser'},
      );

      await createMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400 with "Player already exists" error', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Player already exists',
      });
    });
  });

  describe('when memory game is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const gameId = new mongoose.Types.ObjectId();
      mocks = createMocks(
        gameId,
        {memoryGames: {}},
        {nickname: 'test', color: 'blue'},
        {id: 'testUser'},
      );

      await createMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "MemoryGame not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe('when creating a new player', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const gameId = new mongoose.Types.ObjectId();
      await MemoryGame.create({
        _id: gameId,
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        players: [],
        community: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(
        gameId,
        {memoryGames: {}},
        {nickname: 'test', color: 'blue'},
        {id: 'testUser'},
      );

      await createMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 201 and player details', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        nickname: 'test',
        color: 'blue',
      });
    });

    it('adds the player to session and updates memory game', async () => {
      expect(mocks.req.session).toEqual({
        memoryGames: {
          [mocks.req.params.id]: {
            memoryGamePlayerId: expect.any(String),
          },
        },
      });
    });
  });
});
