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
import {Sprint} from '../../../models';
import routes from '../index';

const getPlayerSprint = applySchemas(routes['/sprints/:id/player'].get);

const createMocks = (
  id: mongoose.Types.ObjectId,
  sessionSprints?: Record<string, unknown> | undefined,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    session: {
      sprints: sessionSprints,
    },
    socketio: {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    },
  });

describe('getPlayerSprint', () => {
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

  describe('when sprint is not found from session', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getPlayerSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found from session',
      });
    });
  });

  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const id = new mongoose.Types.ObjectId();
      mocks = createMocks(id, {
        [id.toHexString()]: {
          strength: {},
        },
      });

      await getPlayerSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when sprint is found', () => {
    let mocks: Mocks<Request, Response>;
    const player1 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-1',
      color: 'test-color-1',
      avatar: 'test-avatar-1',
    };
    const player2 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-2',
      color: 'test-color-2',
      avatar: 'test-avatar-2',
    };
    const player3 = {
      _id: new mongoose.Types.ObjectId(),
      nickname: 'test-nickname-3',
      color: 'test-color-3',
      avatar: 'test-avatar-3',
    };

    beforeEach(async () => {
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        isStarted: true,
        roomCount: 1,
        players: [player1, player2, player3],
        sharedStrengths: [
          {
            from: player1._id,
            to: player2._id,
            strength: 'creativity',
          },
          {
            from: player2._id,
            to: player1._id,
            strength: 'leadership',
          },
        ],
      });

      mocks = createMocks(sprint._id, {
        [sprint._id.toHexString()]: {
          sprintPlayerId: sprint.players[0]._id,
        },
      });

      await getPlayerSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        player: {
          _id: player1._id.toHexString(),
          nickname: 'test-nickname-1',
          color: 'test-color-1',
          avatar: 'test-avatar-1',
        },
        room: [
          {
            _id: player2._id.toHexString(),
            nickname: 'test-nickname-2',
            avatar: 'test-avatar-2',
            color: 'test-color-2',
            strength: 'creativity',
          },
          {
            _id: player3._id.toHexString(),
            nickname: 'test-nickname-3',
            avatar: 'test-avatar-3',
            color: 'test-color-3',
          },
        ],
        players: [
          player1._id.toHexString(),
          player2._id.toHexString(),
          player3._id.toHexString(),
        ],
        receivedStrengths: [
          {
            strength: 'leadership',
            from: {
              nickname: 'test-nickname-2',
              _id: player2._id.toHexString(),
            },
          },
        ],
        isStarted: true,
        isEnded: false,
        isCompleted: false,
      });
    });
  });
});
