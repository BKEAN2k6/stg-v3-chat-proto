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
import {
  User,
  Community,
  Moment,
  Reaction,
  PostReactionNotification,
} from '../../../models';
import routes from '../index';

const updateMyNotificationsRead = applySchemas(
  routes['/users/me/notifications/read'].put,
);

const createRequest = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: userId.toHexString(),
    },
    body: {
      date: new Date().toISOString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('updateMyNotificationsRead', () => {
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

  describe('when user has notifications', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        avatar: 'test-avatar.jpg',
      });

      const actor = await User.create({
        firstName: 'Actor',
        lastName: 'User',
        email: 'actor@test.com',
        avatar: 'test-avatar.jpg',
      });

      const community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
      });

      const moment = await Moment.create({
        content: 'This is a test moment',
        strengths: ['love'],
        createdBy: user,
        community,
      });

      const postReaction = await Reaction.create({
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: actor,
        type: 'like',
      });

      await PostReactionNotification.create({
        user,
        actor,
        targetPost: moment,
        reaction: postReaction,
      });

      mocks = createRequest(user._id);
      await updateMyNotificationsRead(mocks.req, mocks.res);
      await mocks.result;
    });

    it('set the isRead to true', async () => {
      expect(mocks.res.statusCode).toBe(204);
      const notification = await PostReactionNotification.findOne({});
      expect(notification?.isRead).toBe(true);
    });
  });
});
