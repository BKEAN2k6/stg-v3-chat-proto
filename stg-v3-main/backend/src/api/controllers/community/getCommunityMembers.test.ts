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

const getCommunityMembers = applySchemas(
  routes['/communities/:id/members'].get,
);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getCommunityMembers', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getCommunityMembers(mocks.req, mocks.res);
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
        name: 'Test Community',
        description: 'Test Community Description',
        groups: [],
      });

      const user = await registerTestUser({});

      await community.upsertMemberAndSave(user._id, 'member');

      mocks = createMocks(community._id);

      await getCommunityMembers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community users data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          email: 'test@test.com',
          avatar: 'test-avatar.jpg',
          language: 'en',
          role: 'member',
        },
      ]);
    });
  });
});
