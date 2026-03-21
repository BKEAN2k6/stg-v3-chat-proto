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
  SprintResult,
  Reaction,
  Comment,
  CommentCommentNotification,
  CommentReactionNotification,
  PostCommentNotification,
  PostReactionNotification,
} from '../../../models';
import routes from '../index';

const getMyNotifications = applySchemas(routes['/users/me/notifications'].get);

const createRequest = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: userId.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getMyNotifications', () => {
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

      const sprintResult = await SprintResult.create({
        createdBy: user,
        community,
        strengths: [
          {
            strength: 'love',
            count: 1,
          },
          {
            strength: 'compassion',
            count: 2,
          },
        ],
      });

      const momentComment = await Comment.create({
        level: 0,
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: actor,
        content: 'This is a test comment',
        images: [],
      });

      const sprintResultComment = await Comment.create({
        level: 0,
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: actor,
        content: 'This is a test comment',
        images: [],
      });

      const commentCommet = await Comment.create({
        level: 1,
        community,
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: actor,
        content: 'This is a test comment',
        images: [],
      });

      const postReaction = await Reaction.create({
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: actor,
        type: 'like',
      });

      const commentReaction = await Reaction.create({
        community,
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: actor,
        type: 'like',
      });

      await PostCommentNotification.create({
        user,
        actor,
        targetPost: moment,
        comment: momentComment,
      });

      await PostCommentNotification.create({
        user,
        actor,
        targetPost: sprintResult,
        comment: sprintResultComment,
      });

      await CommentCommentNotification.create({
        user,
        actor,
        targetPost: moment,
        targetComment: momentComment,
        comment: commentCommet,
      });

      await PostReactionNotification.create({
        user,
        actor,
        targetPost: moment,
        reaction: postReaction,
      });

      await CommentReactionNotification.create({
        user,
        actor,
        targetPost: moment,
        targetComment: sprintResultComment,
        reaction: commentReaction,
      });

      await CommentReactionNotification.create({
        user,
        actor,
        targetPost: moment,
        targetComment: sprintResultComment,
        reaction: commentReaction,
        isRead: true,
      });

      mocks = createRequest(user._id);
      await getMyNotifications(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the unread notfication', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          _id: expect.any(String),
          notificationType: 'comment-reaction-notification',
          isRead: false,
          actor: {
            _id: expect.any(String),
            firstName: 'Actor',
            lastName: 'User',
            avatar: 'test-avatar.jpg',
          },
          targetComment: {
            _id: expect.any(String),
            content: 'This is a test comment',
          },
          targetPost: {
            _id: expect.any(String),
          },
          createdAt: expect.any(String),
        },
        {
          _id: expect.any(String),
          notificationType: 'post-reaction-notification',
          isRead: false,
          actor: {
            _id: expect.any(String),
            firstName: 'Actor',
            lastName: 'User',
            avatar: 'test-avatar.jpg',
          },
          targetPost: {
            _id: expect.any(String),
            postType: 'moment',
            content: 'This is a test moment',
          },
          createdAt: expect.any(String),
        },
        {
          _id: expect.any(String),
          notificationType: 'comment-comment-notification',
          isRead: false,
          actor: {
            _id: expect.any(String),
            firstName: 'Actor',
            lastName: 'User',
            avatar: 'test-avatar.jpg',
          },
          targetComment: {
            _id: expect.any(String),
            content: 'This is a test comment',
          },
          targetPost: {
            _id: expect.any(String),
          },
          comment: {
            _id: expect.any(String),
            content: 'This is a test comment',
          },
          createdAt: expect.any(String),
        },
        {
          _id: expect.any(String),
          notificationType: 'post-comment-notification',
          isRead: false,
          actor: {
            _id: expect.any(String),
            firstName: 'Actor',
            lastName: 'User',
            avatar: 'test-avatar.jpg',
          },
          targetPost: {
            _id: expect.any(String),
            postType: 'sprint-result',
          },
          createdAt: expect.any(String),
        },
        {
          _id: expect.any(String),
          notificationType: 'post-comment-notification',
          isRead: false,
          actor: {
            _id: expect.any(String),
            firstName: 'Actor',
            lastName: 'User',
            avatar: 'test-avatar.jpg',
          },
          targetPost: {
            _id: expect.any(String),
            postType: 'moment',
            content: 'This is a test moment',
          },
          createdAt: expect.any(String),
        },
      ]);
    });
  });
});
