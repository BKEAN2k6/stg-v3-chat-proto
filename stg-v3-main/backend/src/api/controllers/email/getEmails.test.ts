import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const getEmails = applySchemas(routes['/emails'].get);

const createRequest = () => createMocksAsync({});

describe('getEmails', () => {
  describe('when users are found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await registerTestUser({
        email: 'en@test.com',
        language: 'en',
      });
      await registerTestUser({
        email: 'sv@test.com',
        language: 'sv',
      });

      await registerTestUser({
        email: 'fi@test.com',
        language: 'fi',
      });

      mocks = createRequest();

      await getEmails(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns a list of user emails by language', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        en: ['en@test.com'],
        fi: ['fi@test.com'],
        sv: ['sv@test.com'],
      });
    });
  });
});
