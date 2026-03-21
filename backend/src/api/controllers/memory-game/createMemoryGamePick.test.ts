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
      id: id.toJSON(),
    },
    body,
    session,

    events: {
      emit: vi.fn(),
    },
  });

describe('createMemoryGamePick', () => {
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
        groupGames: {
          [memoryGameId.toJSON()]: {
            playerId: new mongoose.Types.ObjectId().toJSON(),
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
        codeActiveUntil: new Date('2099-01-01'),
        players: [
          {
            _id: player1Id,
            nickname: 'Player1',
            color: 'red',
            avatar: 'avatar1',
          },
          {
            _id: player2Id,
            nickname: 'Player2',
            color: 'blue',
            avatar: 'avatar2',
          },
        ],
        currentlyRevealedCards: [],
        group: new mongoose.Types.ObjectId(),
        cards: [
          {_id: new mongoose.Types.ObjectId(), strength: 'courage'},
          {_id: new mongoose.Types.ObjectId(), strength: 'creativity'},
        ],
        currentPlayer: player1Id,
      });

      const session = {
        groupGames: {
          [memoryGame._id.toJSON()]: {
            playerId: player2Id,
          },
        },
      };

      mocks = createMocks(memoryGame._id, session, {
        cardId: new mongoose.Types.ObjectId().toJSON(),
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
      vi.useFakeTimers({
        legacyFakeTimers: true,
      });

      const player1Id = new mongoose.Types.ObjectId();
      const player2Id = new mongoose.Types.ObjectId();
      const card1Id = new mongoose.Types.ObjectId();
      const card2Id = new mongoose.Types.ObjectId();

      const memoryGame = await MemoryGame.create({
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
        players: [
          {
            _id: player1Id,
            nickname: 'Player1',
            color: 'red',
            avatar: 'avatar1',
          },
          {
            _id: player2Id,
            nickname: 'Player2',
            color: 'blue',
            avatar: 'avatar2',
          },
        ],
        cards: [
          {_id: card1Id, strength: 'courage'},
          {_id: card2Id, strength: 'courage'},
        ],
        currentlyRevealedCards: [card1Id],
        currentPlayer: player1Id,
        group: new mongoose.Types.ObjectId(),
      });

      const session = {
        groupGames: {
          [memoryGame._id.toJSON()]: {
            playerId: player1Id,
          },
        },
      };

      mocks = createMocks(memoryGame._id, session, {
        cardId: card2Id.toJSON(),
      });

      await createMemoryGamePick(mocks.req, mocks.res);
      vi.runAllTimers();
      await mocks.result;
      vi.useRealTimers();
    });

    it('sends a 204 response and updates the game state for a pair', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });
  });
});
