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

const getUser = applySchemas(routes['/users/:id'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getUser', () => {
  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getUser(mocks.req, mocks.res);
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

      const user = await registerTestUser({
        roles: ['super-admin'],
        selectedCommunity: community._id.toJSON(),
      });

      mocks = createMocks(user._id);

      await getUser(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test@test.com',
        language: 'en',
        isEmailVerified: false,
        avatar: 'test-avatar.jpg',
        roles: ['super-admin'],
      });
    });
  });
});
