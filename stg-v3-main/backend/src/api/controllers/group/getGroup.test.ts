import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {
  registerTestUser,
  createTestGroup,
} from '../../../test-utils/testDocuments.js';

const getGroup = applySchemas(routes['/groups/:id'].get);

const createMocks = (groupId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: groupId.toJSON(),
    },
    body: {
      name: 'Updated test group name',
      description: 'Updated test group description',
    },
  });

describe('getGroup', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      await getGroup(mocks.req, mocks.res);

      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );
      mocks = createMocks(group._id);
      await getGroup(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the group data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        name: 'Test Group',
        description: 'Test Group Description',
        language: 'en',
        ageGroup: 'preschool',
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
