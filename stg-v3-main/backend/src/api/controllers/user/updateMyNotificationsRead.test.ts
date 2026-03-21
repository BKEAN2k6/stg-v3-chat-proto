import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import type mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  Community,
  Moment,
  Reaction,
  PostReactionNotification,
} from '../../../models/index.js';
import routes from '../index.js';

const updateMyNotificationsRead = applySchemas(
  routes['/users/me/notifications/read'].put,
);

const createRequest = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: userId.toJSON(),
    },
    body: {
      date: new Date(Date.now() + 1000).toISOString(),
    },
  });

describe('updateMyNotificationsRead', () => {
  describe('when user has notifications', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const actor = await registerTestUser({
        firstName: 'Actor',
        lastName: 'TestLastName',
        email: 'actor@test.com',
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
