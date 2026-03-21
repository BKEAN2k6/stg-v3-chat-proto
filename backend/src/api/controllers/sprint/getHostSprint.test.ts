import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Sprint} from '../../../models/index.js';
import routes from '../index.js';

const getHostSprint = applySchemas(routes['/sprints/:id/host'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getHostSprint', () => {
  describe('when sprint is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getHostSprint(mocks.req, mocks.res);
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
        group: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId(),
        code: '123456',
        codeActiveUntil: new Date('2099-01-01'),
      });
      mocks = createMocks(sprint._id);

      await getHostSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        isEnded: false,
        isCodeActive: true,
        sharedStrengths: [],
        players: [],
        isCompleted: false,
        expectedStrengthCount: 0,
        updatedAt: expect.any(String),
      });
    });
  });
});
