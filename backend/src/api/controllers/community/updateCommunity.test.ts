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

const updateCommunity = applySchemas(routes['/communities/:id'].patch);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      name: 'Test community updated name',
      description: 'This is a test community updated description',
      language: 'fi',
      timezone: 'Europe/Helsinki',
      avatar: 'test-avatar.jpg',
    },
  });

describe('updateCommunity', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
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
        language: 'en',
      });

      mocks = createMocks(community._id);

      await updateCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test community updated name',
          description: 'This is a test community updated description',
          language: 'fi',
          timezone: 'Europe/Helsinki',
          avatar: 'test-avatar.jpg',
        }),
      );
    });
  });
});
