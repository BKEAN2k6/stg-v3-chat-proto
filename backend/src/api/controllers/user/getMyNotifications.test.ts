import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import type mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createTestCommunity,
  registerTestUser,
} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  Moment,
  SprintResult,
  Reaction,
  Comment,
  CommentCommentNotification,
  CommentReactionNotification,
  PostCommentNotification,
  PostReactionNotification,
} from '../../../models/index.js';
import routes from '../index.js';

const getMyNotifications = applySchemas(routes['/users/me/notifications'].get);

const createRequest = (userId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    user: {
      id: userId.toJSON(),
    },
  });

describe('getMyNotifications', () => {
  describe('when user has notifications', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const actor = await registerTestUser({
        firstName: 'Actor',
        lastName: 'TestLastName',
        email: 'actor@test.com',
      });

      const community = await createTestCommunity();

      const moment = await Moment.create({
        content: 'This is a test moment',
        strengths: ['love'],
        createdBy: user,
        community,
      });

      const sprintResult = await SprintResult.create({
        createdBy: user,
        community,
        groupName: 'Test Group',
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
      expect(mocks.res._getJSONData()).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(String),
            notificationType: 'comment-reaction-notification',
            isRead: false,
            actor: {
              id: expect.any(String),
              firstName: 'Actor',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            targetComment: {
              id: expect.any(String),
              content: 'This is a test comment',
            },
            targetPost: {
              id: expect.any(String),
            },
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            notificationType: 'post-reaction-notification',
            isRead: false,
            actor: {
              id: expect.any(String),
              firstName: 'Actor',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            targetPost: {
              id: expect.any(String),
              postType: 'moment',
              content: 'This is a test moment',
            },
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            notificationType: 'comment-comment-notification',
            isRead: false,
            actor: {
              id: expect.any(String),
              firstName: 'Actor',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            targetComment: {
              id: expect.any(String),
              content: 'This is a test comment',
            },
            targetPost: {
              id: expect.any(String),
            },
            comment: {
              id: expect.any(String),
              content: 'This is a test comment',
            },
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            notificationType: 'post-comment-notification',
            isRead: false,
            actor: {
              id: expect.any(String),
              firstName: 'Actor',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            targetPost: {
              id: expect.any(String),
              postType: 'sprint-result',
            },
            createdAt: expect.any(String),
          },
          {
            id: expect.any(String),
            notificationType: 'post-comment-notification',
            isRead: false,
            actor: {
              id: expect.any(String),
              firstName: 'Actor',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            targetPost: {
              id: expect.any(String),
              postType: 'moment',
              content: 'This is a test moment',
            },
            createdAt: expect.any(String),
          },
        ]),
      );
    });
  });
});
