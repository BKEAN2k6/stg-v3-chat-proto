import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {User} from '../../../models/index.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';

const getMyLastActiveGroups = applySchemas(
  routes['/users/me/last-active-groups'].get,
);

const createMocks = (
  userId: mongoose.Types.ObjectId,
): Mocks<Request, Response> =>
  createMocksAsync({
    user: {id: userId.toJSON()},
  });

describe('getMyLastActiveGroups', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('when user is not found', () => {
    let mocks: Mocks<Request, Response>;
    beforeEach(async () => {
      const randomUserId = new mongoose.Types.ObjectId();
      mocks = createMocks(randomUserId);
      await getMyLastActiveGroups(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should send an error response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'User not found',
      });
    });
  });

  describe('when user is found', () => {
    describe('and has defined lastActiveGroups', () => {
      let mocks: Mocks<Request, Response>;
      beforeEach(async () => {
        const testUser = await registerTestUser({
          lastActiveGroups: {community1: 'group1'},
        });
        mocks = createMocks(testUser._id);
        await getMyLastActiveGroups(mocks.req, mocks.res);
        await mocks.result;
      });

      it('should respond with the lastActiveGroups', () => {
        expect(mocks.res.statusCode).toBe(200);
        expect(mocks.res._getJSONData()).toEqual({
          community1: 'group1',
        });
      });
    });

    describe('but does not have lastActiveGroups defined', () => {
      let mocks: Mocks<Request, Response>;
      beforeEach(async () => {
        const testUser = await registerTestUser({lastActiveGroups: undefined});
        mocks = createMocks(testUser._id);
        await getMyLastActiveGroups(mocks.req, mocks.res);
        await mocks.result;
      });

      it('should respond with an empty object', () => {
        expect(mocks.res.statusCode).toBe(200);
        expect(mocks.res._getJSONData()).toEqual({});
      });
    });
  });
});
