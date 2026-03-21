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
import {MemoryGame, Community} from '../../../models';
import routes from '../index';

const removeMemoryGamePlayer = applySchemas(
  routes['/memory-games/:id/players/:playerId'].delete,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  playerId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
      playerId: playerId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('removeMemoryGamePlayer', () => {
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

  describe('when sprint or player is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await removeMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame or player not found',
      });
    });
  });

  describe('when player is successfully removed', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });

      const playerId = new mongoose.Types.ObjectId();
      const sprint = await MemoryGame.create({
        community,
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: playerId,
            nickname: 'test-player',
            color: 'blue',
            avatar: 'avatar-url',
          },
        ],
      });

      mocks = createMocks(sprint._id, playerId);

      await removeMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with 204 No Content', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('emits the updated player list', async () => {
      expect(mocks.req.events.emit).toHaveBeenCalledWith(
        `/memory-games/${mocks.req.params.id}/player`,
        'patch',
        {
          players: [],
        },
      );
    });
  });

  describe('when the player does not exist in the sprint', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });

      const sprint = await MemoryGame.create({
        community,
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'existing-player',
            color: 'blue',
            avatar: 'avatar-url',
          },
        ],
      });

      mocks = createMocks(sprint._id, new mongoose.Types.ObjectId());

      await removeMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with a 404 status code', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'MemoryGame or player not found',
      });
    });
  });

  describe('when an error occurs during event emission', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });

      const playerId = new mongoose.Types.ObjectId();
      const sprint = await MemoryGame.create({
        community,
        createdBy: new mongoose.Types.ObjectId(),
        players: [
          {
            _id: playerId,
            nickname: 'test-player',
            color: 'blue',
            avatar: 'avatar-url',
          },
        ],
      });

      mocks = createMocks(sprint._id, playerId);
      jest
        .spyOn(mocks.req.events, 'emit')
        .mockRejectedValueOnce(new Error('Event error'));

      await removeMemoryGamePlayer(mocks.req, mocks.res);
      await mocks.result;
    });

    it('logs the error but still responds with 204', async () => {
      expect(mocks.res.statusCode).toBe(204);
      expect(mocks.req.logger.log).toHaveBeenCalledWith(
        new Error('Event error'),
      );
    });
  });
});
