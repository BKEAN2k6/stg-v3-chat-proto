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
import {Reaction, Comment, Moment} from '../../../models';
import {type Reaction as ReactionDocument} from '../../../models/Reaction';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const removeReaction = applySchemas(routes['/reactions/:id'].delete);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
    stats: {
      updateCommunityStrenghts: jest.fn(),
      updateLeaderboard: jest.fn(),
      getCommunityStats: jest.fn(),
    },
    events: {
      emit: jest.fn(),
    },
  });
};

describe('removeReaction', () => {
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

  describe('when reaction is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await removeReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Reaction not found',
      });
    });
  });

  describe('when reaction has been created for a post', () => {
    let mocks: Mocks<Request, Response>;
    let reaction: DocumentType<ReactionDocument>;

    beforeEach(async () => {
      const moment = await Moment.create({
        content: 'Test moment content',
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });

      reaction = await Reaction.create({
        type: 'love',
        createdBy: new mongoose.Types.ObjectId(),
        target: moment._id,
        rootTarget: new mongoose.Types.ObjectId(),
        community: moment.community,
      });

      jest.spyOn(reaction, 'delete');
      jest.spyOn(Reaction, 'findById').mockResolvedValueOnce(reaction);

      mocks = createMocks(reaction._id);
      await removeReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('deletes the post', async () => {
      expect(reaction.delete).toHaveBeenCalled();
    });
  });

  describe('when reaction has been created for a comment', () => {
    let mocks: Mocks<Request, Response>;
    let reaction: DocumentType<ReactionDocument>;

    beforeEach(async () => {
      const comment = await Comment.create({
        level: 0,
        community: new mongoose.Types.ObjectId(),
        content: 'Test comment content',
        createdBy: new mongoose.Types.ObjectId(),
        target: new mongoose.Types.ObjectId(),
        rootTarget: new mongoose.Types.ObjectId(),
      });

      reaction = await Reaction.create({
        type: 'love',
        createdBy: new mongoose.Types.ObjectId(),
        target: comment._id,
        rootTarget: new mongoose.Types.ObjectId(),
        community: comment.community,
      });

      jest.spyOn(reaction, 'delete');
      jest.spyOn(Reaction, 'findById').mockResolvedValueOnce(reaction);

      mocks = createMocks(reaction._id);
      await removeReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('deletes the post', async () => {
      expect(reaction.delete).toHaveBeenCalled();
    });
  });
});
