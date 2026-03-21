import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Community} from '../../../models/index.js';
import routes from '../index.js';

const getCommunity = applySchemas(routes['/communities/:id'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getCommunity', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());
      await getCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      await getCommunity(mocks.req, mocks.res);

      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test community',
        description: 'This is a test community',
        language: 'fi',
        avatar: 'test-avatar.jpg',
      });

      mocks = createMocks(community._id);
      await getCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test community',
          description: 'This is a test community',
          language: 'fi',
          timezone: 'Etc/GMT',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });
});
