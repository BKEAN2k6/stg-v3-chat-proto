import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const updateUser = applySchemas(routes['/users/:id'].patch);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      password: 'updatedPassword',
      email: 'updated@test.email',
      language: 'fi',
      isEmailVerified: true,
      roles: ['super-admin'],
    },
  });

describe('updateUser', () => {
  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateUser(mocks.req, mocks.res);
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
      const user = await registerTestUser({
        roles: ['super-admin'],
      });

      mocks = createMocks(user._id);
      await updateUser(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the updated user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        email: 'updated@test.email',
        language: 'fi',
        isEmailVerified: true,
        roles: ['super-admin'],
      });
    });
  });
});
