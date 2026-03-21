import {beforeEach, describe, expect, it, vi} from 'vitest';
import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {Comment} from '../../../models/index.js';
import {type Comment as CommentDocument} from '../../../models/Comment.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const removeComment = applySchemas(routes['/comments/:id'].delete);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toJSON(),
    },
    events: {
      emit: vi.fn(),
    },
    stats: {
      updateCommunityStrenghts: vi.fn(),
      updateLeaderboard: vi.fn(),
      getCommunityStats: vi.fn(),
    },
  });
};

describe('removeComment', () => {
  describe('when comment is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await removeComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Comment not found',
      });
    });
  });

  describe('when comment is found', () => {
    let mocks: Mocks<Request, Response>;
    let comment: DocumentType<CommentDocument>;

    beforeEach(async () => {
      comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        content: 'Test comment content',
        createdBy: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
      });

      vi.spyOn(comment, 'delete');
      vi.spyOn(Comment, 'findById').mockResolvedValueOnce(comment);

      mocks = createMocks(comment._id);
      await removeComment(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('deletes the comment', async () => {
      expect(comment.delete).toHaveBeenCalled();
    });
  });
});
