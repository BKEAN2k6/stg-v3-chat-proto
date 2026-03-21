import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {createTestGroup} from '../../../test-utils/testDocuments.js';

const createMemoryGame = applySchemas(routes['/groups/:id/memory-games'].post);

const createMocks = (
  id: mongoose.Types.ObjectId,
  body?: Record<string, unknown>,
) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body,
    user: {
      _id: new mongoose.Types.ObjectId(),
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('createMemoryGame', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId(), {numberOfCards: 6});

      await createMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 404 error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when game is successfully created', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await createTestGroup();

      mocks = createMocks(group._id, {numberOfCards: 6});

      await createMemoryGame(mocks.req, mocks.res);
      await mocks.result;
    });

    it('creates a memory game and sends a 201 response', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
      });
    });
  });
});
