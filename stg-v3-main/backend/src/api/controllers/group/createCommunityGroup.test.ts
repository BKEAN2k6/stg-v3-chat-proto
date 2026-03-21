import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {Community, User} from '../../../models/index.js';
import {type Community as CommunitySchema} from '../../../models/Community.js';
import {type User as UserSchema} from '../../../models/User.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {
  registerTestUser,
  createTestCommunity,
} from '../../../test-utils/testDocuments.js';

const createCommunityGroup = applySchemas(
  routes['/communities/:id/groups'].post,
);

const createMocks = (
  communityId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    body: {
      name: 'Test group',
      description: 'This is a test group',
      owner: userId.toJSON(),
    },
    params: {
      id: communityId.toJSON(),
    },
    user: {
      id: userId.toJSON(),
      language: 'en',
      save: vi.fn(),
    },
  });

describe('createCommunityGroup', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      vi.spyOn(Community, 'findById').mockResolvedValueOnce(null);
      const mockUser = await registerTestUser({});
      mocks = createMocks(new mongoose.Types.ObjectId(), mockUser._id);

      await createCommunityGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found and creating a group succeeds', () => {
    let mocks: Mocks<Request, Response>;
    let community: DocumentType<CommunitySchema>;
    let user: DocumentType<UserSchema>;

    beforeEach(async () => {
      await User.deleteMany({});
      community = await createTestCommunity();

      user = await registerTestUser({});
      await community.upsertMemberAndSave(user._id, 'admin');
      mocks = createMocks(community._id, user._id);
      await createCommunityGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        description: 'This is a test group',
        name: 'Test group',
        ageGroup: 'preschool',
        language: 'en',
        owner: {
          id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        articleProgress: [],
      });
    });

    it('should update the user lastActiveGroups', async () => {
      const databaseUser = await User.findById(user._id);
      const communityId = community._id.toJSON();
      const groupId = (mocks.res._getJSONData() as {id: string}).id;

      expect(databaseUser?.toJSON().lastActiveGroups).toEqual({
        [communityId]: groupId,
      });
    });
  });
});
