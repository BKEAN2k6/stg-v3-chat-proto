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
} from '../../../test-utils/testDocuments.js';

const updateGroup = applySchemas(routes['/groups/:id'].patch);

const createMocks = (
  groupId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    params: {
      id: groupId.toJSON(),
    },
    body: {
      name: 'Updated test group name',
      description: 'Updated test group description',
      owner: userId.toJSON(),
      language: 'fi',
      ageGroup: '7-8',
    },
  });

describe('updateGroup', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await updateGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const group = await createTestGroup(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );
      const user = await registerTestUser({});
      mocks = createMocks(group._id, user._id);

      await updateGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the updated group data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        name: 'Updated test group name',
        description: 'Updated test group description',
        language: 'fi',
        ageGroup: '7-8',
        owner: {
          id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        articleProgress: [],
      });
    });
  });
});
