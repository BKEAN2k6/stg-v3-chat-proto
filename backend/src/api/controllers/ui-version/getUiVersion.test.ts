import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const getUiVersion = applySchemas(routes['/ui-version'].get);

const createMocks = () => createMocksAsync({});

describe('getUiVersion', () => {
  let mocks: Mocks<Request, Response>;

  beforeEach(async () => {
    mocks = createMocks();
    await getUiVersion(mocks.req, mocks.res);
    await mocks.result;
  });

  it('returns the UI version with a 200 status', async () => {
    expect(mocks.res.statusCode).toBe(200);
    expect(mocks.res._getJSONData()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
