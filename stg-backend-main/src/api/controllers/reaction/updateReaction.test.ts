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
import {Reaction, Comment, User} from '../../../models';
import {type Reaction as ReactionDocument} from '../../../models/Reaction';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const updateReaction = applySchemas(routes['/reactions/:id'].patch);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    body: {
      type: 'compassion',
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

describe('updateReaction', () => {
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
      const user = await User.create({
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: 'test-avatar.jpg',
      });

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

      jest.spyOn(reaction, 'delete');
      jest.spyOn(Reaction, 'findById').mockResolvedValueOnce(reaction);

      mocks = createMocks(reaction._id);
      await updateReaction(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with update reaction', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: expect.any(String),
        createdAt: expect.any(String),
        createdBy: {
          _id: expect.any(String),
          avatar: 'test-avatar.jpg',
          firstName: 'Test',
          lastName: 'User',
        },
        type: 'compassion',
      });
    });
  });
});
