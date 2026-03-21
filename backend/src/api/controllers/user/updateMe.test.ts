import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {User, Community} from '../../../models/index.js';
import routes from '../index.js';

const updateMe = applySchemas(routes['/users/me'].patch);

const createMocks = (
  id: mongoose.Types.ObjectId,
  selectedCommunity: mongoose.Types.ObjectId,
) =>
  createMocksAsync({
    user: {
      id: id.toJSON(),
    },
    body: {
      selectedCommunity,
      firstName: 'UpdatedFirstName',
      lastName: 'UpdatedLastName',
      language: 'fi',
      password: 'oldPassword',
      newPassword: 'newPassword',
      consents: {
        vimeo: true,
      },
      hasSetConsents: true,
    },
  });

describe('updateMe', () => {
  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      );

      await updateMe(mocks.req, mocks.res);
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
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        groups: [],
      });

      communityId = community._id;

      const user = await registerTestUser({}, 'oldPassword');

      mocks = createMocks(user._id, community._id);

      await updateMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the updated user data', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        avatar: 'test-avatar.jpg',
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        language: 'fi',
        selectedCommunity: communityId.toJSON(),
        consents: {
          vimeo: true,
        },
        hasSetConsents: true,
      });
    });
  });

  describe('when old password does not match', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.deleteMany({});
      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
        language: 'en',
        groups: [],
      });

      const user = await registerTestUser({}, 'wrongPassword');

      mocks = createMocks(user._id, community._id);

      await updateMe(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with an error message', async () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Existing password did not match',
      });
    });
  });
});
