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

const createMemoryGamePick = applySchemas(
  routes['/memory-games/:id/picks'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  session?: Record<string, unknown>,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body,
    session,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createMemoryGamePick', () => {
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

  describe('when session memory game is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        {memoryGames: {}},
        {cardId: 'invalid-card-id'},
      );

      await createMemoryGamePick(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 404 error response for missing memory game session', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found from session',
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

      mocks = createMocks(memoryGameId, session, {
        cardId: 'invalid-card-id',
      });

      await createMemoryGamePick(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 404 error response for missing memory game', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe("when it is not the player's turn", () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const player1Id = new mongoose.Types.ObjectId();
      const player2Id = new mongoose.Types.ObjectId();

      const memoryGame = await MemoryGame.create({
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        players: [
          {_id: player1Id, nickname: 'Player1', color: 'red'},
          {_id: player2Id, nickname: 'Player2', color: 'blue'},
        ],
        currentlyRevealedCards: [],
        community: new mongoose.Types.ObjectId(),
        cards: [
          {_id: new mongoose.Types.ObjectId(), strength: 'courage'},
          {_id: new mongoose.Types.ObjectId(), strength: 'creativity'},
        ],
        currentPlayer: player1Id,
      });

      const session = {
        memoryGames: {
          [memoryGame._id.toHexString()]: {
            memoryGamePlayerId: player2Id,
          },
        },
      };

      mocks = createMocks(memoryGame._id, session, {
        cardId: new mongoose.Types.ObjectId().toHexString(),
      });

      await createMemoryGamePick(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 400 error response for incorrect player turn', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Not your turn',
      });
    });
  });

  describe('when picking a second card to form a pair', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      jest.useFakeTimers({
        legacyFakeTimers: true,
      });

      const player1Id = new mongoose.Types.ObjectId();
      const player2Id = new mongoose.Types.ObjectId();
      const card1Id = new mongoose.Types.ObjectId();
      const card2Id = new mongoose.Types.ObjectId();

      const memoryGame = await MemoryGame.create({
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        players: [
          {_id: player1Id, nickname: 'Player1', color: 'red'},
          {_id: player2Id, nickname: 'Player2', color: 'blue'},
        ],
        cards: [
          {_id: card1Id, strength: 'courage'},
          {_id: card2Id, strength: 'courage'},
        ],
        currentlyRevealedCards: [card1Id],
        currentPlayer: player1Id,
        community: new mongoose.Types.ObjectId(),
      });

      const session = {
        memoryGames: {
          [memoryGame._id.toHexString()]: {
            memoryGamePlayerId: player1Id,
          },
        },
      };

      mocks = createMocks(memoryGame._id, session, {
        cardId: card2Id.toHexString(),
      });

      await createMemoryGamePick(mocks.req, mocks.res);
      jest.runAllTimers();
      await mocks.result;
      jest.useRealTimers();
    });

    it('sends a 204 response and updates the game state for a pair', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
