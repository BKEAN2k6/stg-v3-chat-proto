import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {User} from '../../../models';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const getEmails = applySchemas(routes['/emails'].get);

const createRequest = () =>
  createMocksAsync({
    logger: {
      log: jest.fn(),
    },
  });

describe('getEmails', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mongoose.connect(global.__MONGO_URI__, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dbName: global.__MONGO_DB_NAME__,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('when users are found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      await User.create({
        email: 'en@test.com',
        language: 'en',
      });
      await User.create({
        email: 'sv@test.com',
        language: 'sv',
      });

      await User.create({
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
