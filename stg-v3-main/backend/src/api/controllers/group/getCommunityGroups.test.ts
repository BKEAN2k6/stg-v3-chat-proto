import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {
  registerTestUser,
  createTestGroup,
  createTestCommunity,
} from '../../../test-utils/testDocuments.js';

const getCommunityGroups = applySchemas(routes['/communities/:id/groups'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getCommunityGroups', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getCommunityGroups(mocks.req, mocks.res);
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
      const user = await registerTestUser({});
      const community = await createTestCommunity();
      const group = await createTestGroup(user._id, community._id);

      community.set('groups', [group._id]);
      await group.save();
      await community.save();

      mocks = createMocks(community._id);

      await getCommunityGroups(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community groups', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          description: 'Test Group Description',
          name: 'Test Group',
          language: 'en',
          ageGroup: 'preschool',
          owner: {
            id: expect.any(String),
            avatar: 'test-avatar.jpg',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
          },
          articleProgress: [],
        },
      ]);
    });
  });
});
