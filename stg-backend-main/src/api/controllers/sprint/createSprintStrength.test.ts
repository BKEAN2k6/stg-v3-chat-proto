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

const createSprintStrength = applySchemas(
  routes['/sprints/:id/strengths'].post,
);

const createMocks = (
  id: mongoose.Types.ObjectId,
  sessionSprints?: Record<string, unknown> | undefined,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body: {
      strength: 'carefulness',
      to: new mongoose.Types.ObjectId(),
    },
    logger: {
      log: jest.fn(),
    },
    session: {
      user: {
        _id: new mongoose.Types.ObjectId(),
      },
      sprints: sessionSprints,
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('createSprintStrength', () => {
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
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      mocks = createMocks(sprint._id);

      await createSprintStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found from session',
      });
    });
  });

  describe('when sprint is not found from the database', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const id = new mongoose.Types.ObjectId();
      mocks = createMocks(id, {
        [id.toHexString()]: {
          strength: {},
        },
      });

      await createSprintStrength(mocks.req, mocks.res);
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

    beforeEach(async () => {
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });
      mocks = createMocks(sprint._id, {
        [sprint._id.toHexString()]: {
          strength: {},
        },
      });

      await createSprintStrength(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the player data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        strength: 'carefulness',
        to: expect.any(String),
      });
    });
  });
});
