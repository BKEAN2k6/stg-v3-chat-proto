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
import {Post, Moment} from '../../../models';
import {type Post as PostDocument} from '../../../models/Post/Post';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const removePost = applySchemas(routes['/posts/:id'].delete);

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

describe('removePost', () => {
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

  describe('when post is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await removePost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Post not found',
      });
    });
  });

  describe('when post is found', () => {
    let mocks: Mocks<Request, Response>;
    let moment: DocumentType<PostDocument>;

    beforeEach(async () => {
      moment = await Moment.create({
        createdBy: new mongoose.Types.ObjectId(),
        community: new mongoose.Types.ObjectId(),
      });

      jest.spyOn(moment, 'delete');

      jest.spyOn(Post, 'findById').mockResolvedValueOnce(moment);

      mocks = createMocks(moment._id);
      await removePost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with 204 status', async () => {
      expect(mocks.res.statusCode).toBe(204);
    });

    it('deletes the post and all proxy posts', async () => {
      expect(moment.delete).toHaveBeenCalled();
    });
  });
});
