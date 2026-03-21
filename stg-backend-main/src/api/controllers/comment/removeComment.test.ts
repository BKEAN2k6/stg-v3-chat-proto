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
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {Comment} from '../../../models';
import {type Comment as CommentDocument} from '../../../models/Comment';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const removeComment = applySchemas(routes['/comments/:id'].delete);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
    stats: {
      updateCommunityStrenghts: jest.fn(),
      updateLeaderboard: jest.fn(),
      getCommunityStats: jest.fn(),
    },
  });
};

describe('removeComment', () => {
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

      jest.spyOn(comment, 'delete');
      jest.spyOn(Comment, 'findById').mockResolvedValueOnce(comment);

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
