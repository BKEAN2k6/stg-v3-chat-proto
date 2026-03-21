import {
  jest,
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import {CommunityInvitation, Community} from '../../../models';
import routes from '../index';

const getCommunityInvitationWithCode = applySchemas(
  routes['/community-invitations/:code'].get,
);

const createMocks = (code: string) =>
  createMocksAsync({
    params: {
      code,
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });

describe('getCommunityInvitationWithCode', () => {
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

  describe('when community invitation is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks('invalid-code');

      await getCommunityInvitationWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404 with "Invitation not found" error', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invitation not found',
      });
    });
  });

  describe('when community invitation is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'Test Community',
        avatar: 'test-avatar.png',
      });

      const invitation = await CommunityInvitation.create({
        community,
      });

      mocks = createMocks(invitation.code);

      await getCommunityInvitationWithCode(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 and the community data', async () => {
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        name: 'Test Community',
        avatar: 'test-avatar.png',
      });
      expect(mocks.res.statusCode).toBe(200);
    });
  });
});
