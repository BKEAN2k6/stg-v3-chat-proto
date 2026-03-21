import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {Community} from '../../../models/index.js';
import routes from '../index.js';

const getUserCommunities = applySchemas(routes['/users/:id/communities'].get);

const createRequest = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getUserCommunities', () => {
  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createRequest(new mongoose.Types.ObjectId());

      await getUserCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when user is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        groups: [],
      });

      const user = await registerTestUser({});

      await community.upsertMemberAndSave(user._id, 'member');

      mocks = createRequest(user._id);

      await getUserCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the user communities data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          name: 'Test Community',
          role: 'member',
        },
      ]);
    });
  });
});
