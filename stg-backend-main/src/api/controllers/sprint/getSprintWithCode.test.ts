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

const getSprintWithCode = applySchemas(routes['/sprints/:code'].get);

const createMocks = (code: string, sprintId: string, sprintPlayerId?: string) =>
  createMocksAsync({
    params: {
      code,
    },
    session: {
      ...(sprintPlayerId && {
        sprints: {
          [sprintId]: {
            sprintPlayerId,
          },
        },
      }),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getSprintWithCode', () => {
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

  describe('when sprint is not found with code', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        'non-existant-code',
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId().toHexString(),
      );

      await getSprintWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when sprint is found with code and user has joined the sprint', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const player = {
        _id: new mongoose.Types.ObjectId(),
        nickname: 'nickname',
        color: 'color',
        avatar: 'avatar',
      };
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        players: [player],
      });

      mocks = createMocks(
        sprint.code,
        sprint._id.toHexString(),
        player._id.toHexString(),
      );

      await getSprintWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isRegistered: true,
      });
    });
  });

  describe('when sprint is found with code and user has not joined the sprint', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const sprint = await Sprint.create({
        community: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        players: [],
      });

      mocks = createMocks(
        sprint.code,
        new mongoose.Types.ObjectId().toHexString(),
      );

      await getSprintWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isRegistered: false,
      });
    });
  });
});
