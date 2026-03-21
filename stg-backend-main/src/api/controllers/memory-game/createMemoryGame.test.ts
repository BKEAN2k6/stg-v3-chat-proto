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
import {Community} from '../../../models';
import routes from '../index';

const createMemoryGame = applySchemas(
  routes['/community/:id/memory-games'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body,
    user: {
      _id: new mongoose.Types.ObjectId(),
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createMemoryGame', () => {
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

  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {numberOfCards: 6});

      await createMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 404 error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when game is successfully created', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'Test community for memory game',
        name: 'Test Community',
      });

      mocks = createMocks(community._id, {numberOfCards: 6});

      await createMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('creates a memory game and sends a 201 response', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
      });
    });
  });
});
