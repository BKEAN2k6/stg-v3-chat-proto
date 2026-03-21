import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import type mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';

const createCommunity = applySchemas(routes['/communities'].post);

const createMocks = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    body: {
      name: 'Test Community',
      description: 'This is a test community',
      language: 'en',
      timezone: 'Europe/Helsinki',
    },
    user: {
      id: userId.toJSON(),
    },
  });

describe('createCommunity', () => {
  describe('when saving community succeeds', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});
      mocks = createMocks(user._id);

      await createCommunity(mocks.req, mocks.res);
      await mocks.result;
    });

    it('should respond with the community data', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'Test Community',
          language: 'en',
          description: 'This is a test community',
          timezone: 'Europe/Helsinki',
          avatar: '',
        }),
      );
    });
  });
});
