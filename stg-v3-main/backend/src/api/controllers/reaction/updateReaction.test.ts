import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {Reaction, Comment} from '../../../models/index.js';
import {type Reaction as ReactionDocument} from '../../../models/Reaction.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const updateReaction = applySchemas(routes['/reactions/:id'].patch);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    body: {
      type: 'compassion',
    },
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
      getCommunityStats: vi.fn(),
    },
    events: {
      emit: vi.fn(),
    },
  });
};

describe('updateReaction', () => {
  describe('when reaction is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await updateReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Reaction not found',
      });
    });
  });

  describe('when update succeeds', () => {
    let mocks: Mocks<Request, Response>;
    let reaction: DocumentType<ReactionDocument>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        content: 'Test post content',
        createdBy: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
      });

      reaction = await Reaction.create({
        type: 'love',
        createdBy: user,
        target: comment._id,
        rootTarget: new mongoose.Types.ObjectId(),
        community: comment.community,
      });

      vi.spyOn(reaction, 'delete');
      vi.spyOn(Reaction, 'findById').mockResolvedValueOnce(reaction);

      mocks = createMocks(reaction._id);
      await updateReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with update reaction', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        createdBy: {
          id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        type: 'compassion',
      });
    });
  });
});
