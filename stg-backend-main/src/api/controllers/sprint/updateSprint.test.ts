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
import {Sprint, Community, SprintResult} from '../../../models';
import routes from '../index';

const updateSprint = applySchemas(routes['/sprints/:id/host'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body,
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('updateSprint', () => {
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

  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Sprint not found',
      });
    });
  });

  describe('when isStarted and isEnded are false', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });
      const sprint = await Sprint.create({
        createdBy: new mongoose.Types.ObjectId(),
        community,
        isStarted: false,
        isEnded: false,
      });
      mocks = createMocks(sprint._id, {});

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('the response does not contain a room count', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isStarted: false,
        isEnded: false,
        isCompleted: false,
        expectedStrengthCount: 0,
        sharedStrengths: [],
        players: [],
        code: expect.any(String),
      });
    });
  });

  describe('when isStarted is set to true', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        description: 'This is a test communit',
        name: 'Test community',
      });

      const sprint = await Sprint.create({
        community,
        createdBy: new mongoose.Types.ObjectId(),
        isStarted: false,
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'test-nickname-1',
            color: 'test-color-1',
            avatar: 'test-avatar-1',
          },
        ],
      });
      mocks = createMocks(sprint._id, {
        isStarted: true,
      });

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('the response contains a room count', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        isStarted: true,
        isEnded: false,
        isCompleted: true,
        expectedStrengthCount: 0,
        sharedStrengths: [],
        players: [
          {
            _id: expect.any(String),
            nickname: 'test-nickname-1',
            color: 'test-color-1',
          },
        ],
        code: expect.any(String),
      });
    });
  });

  describe('when isEnded is set to true', () => {
    describe('and the sprint does not have any strengths given', () => {
      let mocks: Mocks<Request, Response>;

      beforeEach(async () => {
        jest.spyOn(SprintResult, 'create');
        const community = await Community.create({
          description: 'This is a test community',
          name: 'Test community',
        });

        const sprint = await Sprint.create({
          community,
          createdBy: new mongoose.Types.ObjectId(),
          isStarted: true,
          roomCount: 1,
          players: [
            {
              _id: new mongoose.Types.ObjectId(),
              nickname: 'test-nickname-1',
              color: 'test-color-1',
              avatar: 'test-avatar-1',
            },
          ],
        });
        mocks = createMocks(sprint._id, {
          isEnded: true,
        });

        await updateSprint(mocks.req, mocks.res);
        await mocks.result;
      });

      it('it does not create a new moment', async () => {
        expect(SprintResult.create).not.toHaveBeenCalled();
        expect(mocks.res.statusCode).toBe(200);
      });
    });
  });

  describe('and the sprint does has strengths given', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      jest.spyOn(SprintResult, 'create');
      const community = await Community.create({
        description: 'This is a test community',
        name: 'Test community',
      });

      const sprint = await Sprint.create({
        community,
        createdBy: new mongoose.Types.ObjectId(),
        isStarted: true,
        roomCount: 1,
        players: [
          {
            _id: new mongoose.Types.ObjectId(),
            nickname: 'test-nickname-1',
            color: 'test-color-1',
            avatar: 'test-avatar-1',
          },
        ],
        sharedStrengths: [
          {
            from: new mongoose.Types.ObjectId(),
            to: new mongoose.Types.ObjectId(),
            strength: 'love',
          },
        ],
      });
      mocks = createMocks(sprint._id, {
        isEnded: true,
      });

      await updateSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it does not create a new moment', async () => {
      expect(SprintResult.create).toHaveBeenCalled();
      expect(mocks.res.statusCode).toBe(200);
    });
  });
});
