import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {User} from '../../../models/index.js';
import routes from '../index.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';

const getUsers = applySchemas(routes['/users'].get);

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
  });

describe('getUsers', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    await registerTestUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test1@test.com',
    });

    await registerTestUser({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'test2@test.com',
    });

    await registerTestUser({
      firstName: 'Jim',
      lastName: 'Jones',
      email: 'jimmy@jones.com',
    });
  });

  describe('when query matches first name', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('joh');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the found users', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'John',
          lastName: 'Doe',
          email: 'test1@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('when query matches last name', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('Smit');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the found users', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('when query matches email', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('jimm');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the found users', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jim',
          lastName: 'Jones',
          email: 'jimmy@jones.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('with multiple search words', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('jimm Jane');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all matching results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
        {
          id: expect.any(String),
          firstName: 'Jim',
          lastName: 'Jones',
          email: 'jimmy@jones.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('with limit parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('jimm Jane', '1');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it limits the number of results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('with skip parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('jimm Jane', '0', '1');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('it skips the number of results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jim',
          lastName: 'Jones',
          email: 'jimmy@jones.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('with sort parameter', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('jimm Jane', '100', '0', '-firstName');

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sorts the results', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jim',
          lastName: 'Jones',
          email: 'jimmy@jones.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
        {
          id: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });

  describe('without search term', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks();

      await getUsers(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all users', async () => {
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
        {
          id: expect.any(String),
          firstName: 'Jim',
          lastName: 'Jones',
          email: 'jimmy@jones.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
        {
          id: expect.any(String),
          firstName: 'John',
          lastName: 'Doe',
          email: 'test1@test.com',
          language: 'en',
          avatar: 'test-avatar.jpg',
          isEmailVerified: false,
          roles: [],
        },
      ]);
    });
  });
});
