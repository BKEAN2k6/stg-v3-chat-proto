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
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {Community} from '../../../models';
import routes from '../index';

const getCommunities = applySchemas(routes['/communities'].get);

const createMocks = (
  search?: string,
  limit?: string,
  skip?: string,
  sort?: string,
) =>
  createMocksAsync({
    query: {
      search,
      skip,
      limit,
      sort,
    },
    logger: {
      log: jest.fn(),
    },
  });
describe('getCommunities', () => {
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

  beforeEach(async () => {
    await Community.deleteMany({});

    await Community.create({
      name: '1 Test Community',
      description: '1 Test Community desctiption',
    });

    await Community.create({
      name: '2 Test Community',
      description: '2 Test Community desctiption',
    });

    await Community.create({
      name: '3 Test Community',
      description: '3 Test Community desctiption',
    });
  });

  describe('when query matches name', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('1');

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the found communities', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });

  describe('with multiple search words', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('1 2');

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all matching results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
        {
          _id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });

  describe('with limit parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('1 2', '1');

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it limits the number of results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });

  describe('with skip parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('1 2', '0', '1');

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it skips the number of results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });

  describe('with sort parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('1 2', '100', '0', '-name');

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sorts the results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
        {
          _id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });

  describe('without search term', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks();

      await getCommunities(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all communities', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          name: '1 Test Community',
          description: '1 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
        {
          _id: expect.any(String),
          name: '2 Test Community',
          description: '2 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
        {
          _id: expect.any(String),
          name: '3 Test Community',
          description: '3 Test Community desctiption',
          language: 'en',
          timezone: 'Etc/GMT',
          avatar: '',
        },
      ]);
    });
  });
});
