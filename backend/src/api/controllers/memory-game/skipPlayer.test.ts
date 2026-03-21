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

const skipPlayer = applySchemas(routes['/memory-games/:id/skip'].post);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {id: id.toJSON()},

    events: {
      emit: vi.fn(),
    },
  });

describe('skipPlayer', () => {
  describe('when the memory game is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await skipPlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "MemoryGame not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame not found',
      });
    });
  });

  describe('when skipping the current player', () => {
    let mocks: Mocks<Request, Response>;
    let player1Id: mongoose.Types.ObjectId;
    let player2Id: mongoose.Types.ObjectId;

    beforeEach(async () => {
      await MemoryGame.deleteMany({});
      player1Id = new mongoose.Types.ObjectId();
      player2Id = new mongoose.Types.ObjectId();

      const memoryGame = await MemoryGame.create({
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
        currentPlayer: player1Id,
        currentlyRevealedCards: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
      });

      mocks = createMocks(memoryGame._id);

      await skipPlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates the current player to the next player', async () => {
      const updatedMemoryGame = await MemoryGame.findOne();
      expect(updatedMemoryGame?.currentPlayer?.toJSON()).toEqual(
        player2Id.toJSON(),
      );
      expect(updatedMemoryGame?.currentlyRevealedCards).toEqual([]);
    });

    it('returns 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('emits a patch event with the updated game state', async () => {
      expect(mocks.req.events.emit).toHaveBeenCalledWith(
        `/memory-games/${mocks.req.params.id}`,
        'patch',
        {
          currentPlayer: player2Id.toJSON(),
          currentlyRevealedCards: [],
          foundPairs: [],
          isEnded: false,
          players: [
            {
              avatar: 'avatar1',
              color: 'red',
              id: expect.any(String),
              nickname: 'Player1',
            },
            {
              avatar: 'avatar2',
              color: 'blue',
              id: expect.any(String),
              nickname: 'Player2',
            },
          ],
          updatedAt: expect.any(String),
        },
      );
    });
  });
});
