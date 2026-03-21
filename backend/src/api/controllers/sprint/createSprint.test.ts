import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {createTestGroup} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';

const createSprint = applySchemas(routes['/groups/:id/sprints'].post);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {},
    params: {
      id: id.toJSON(),
    },
    user: {
      _id: new mongoose.Types.ObjectId(),
    },
  });

describe('createSprint', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await createSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group exists and creating a sprint succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await createTestGroup();
      mocks = createMocks(group._id);

      await createSprint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the sprint data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        code: expect.any(String),
      });
    });
  });
});
