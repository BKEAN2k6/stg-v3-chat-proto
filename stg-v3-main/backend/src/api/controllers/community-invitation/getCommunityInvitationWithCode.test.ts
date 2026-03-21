import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {CommunityInvitation, Community} from '../../../models/index.js';
import routes from '../index.js';

const getCommunityInvitationWithCode = applySchemas(
  routes['/community-invitations/:code'].get,
);

const createMocks = (code: string) =>
  createMocksAsync({
    params: {
      code,
    },
    events: {
      emit: vi.fn(),
    },
  });

describe('getCommunityInvitationWithCode', () => {
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
        id: expect.any(String),
        name: 'Test Community',
        avatar: 'test-avatar.png',
      });
      expect(mocks.res.statusCode).toBe(200);
    });
  });
});
