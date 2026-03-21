import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';

const checkEmailExists = applySchemas(routes['/check-email'].post);

const createMocks = (email: string) =>
  createMocksAsync({
    body: {
      email,
    },
  });

describe('checkEmailExists', () => {
  describe('when user exists', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await registerTestUser({
        email: 'existing@example.com',
      });

      mocks = createMocks('existing@example.com');

      await checkEmailExists(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds true for exists', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({exists: true});
    });
  });

  describe('when user does not exist', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('nonexistent@example.com');

      await checkEmailExists(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds false for exists', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({exists: false});
    });
  });
});
