import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {Notification} from '../../../models/index.js';
import {
  type PostCommentNotification,
  type PostReactionNotification,
  type GetMyNotificationsResponse,
  type CommentReactionNotification,
  type CommunityInvitationNotification,
  type CommentCommentNotification,
} from '../../client/ApiTypes.js';

export async function getMyNotifications(
  request: Request,
  response: Response,
): Promise<void> {
  const notifications = await Notification.find({
    user: new mongoose.Types.ObjectId(request.user.id),
    isRead: false,
  })
    .sort({createdAt: -1})
    .select(
      '_id actor isRead createdAt notificationType reaction comment targetComment targetPost community invitation',
    )
    .populate([
      {
        path: 'actor',
        select: '_id firstName lastName avatar',
      },
      {
        path: 'reaction',
        select: 'type',
      },
      {
        path: 'comment',
        select: 'content',
      },
      {
        path: 'targetComment',
        select: 'content',
      },
      {
        path: 'targetPost',
        select: 'content postType',
      },
      {
        path: 'community',
        select: '_id name',
      },
      {
        path: 'invitation',
        select: '_id',
      },
    ]);

  response.json(
    // eslint-disable-next-line complexity
    notifications.map((notification) => {
      if (Notification.isPostCommentNotification(notification)) {
        if (
          !isDocument(notification.actor) ||
          !isDocument(notification.comment) ||
          !isDocument(notification.targetPost)
        ) {
          throw new Error('Actor, comment or target post is not populated');
        }

        if (
          notification.targetPost.postType !== 'moment' &&
          notification.targetPost.postType !== 'sprint-result'
        ) {
          throw new Error('Post type is not moment or sprint-result');
        }

        return {
          ...notification.toJSON(),
          actor: notification.actor.toJSON(),
          targetPost: {
            ...notification.targetPost.toJSON(),
            postType: notification.targetPost.postType,
          },
          notificationType: 'post-comment-notification',
          createdAt: notification.createdAt!.toJSON(),
        } satisfies PostCommentNotification;
      }

      if (Notification.isPostReactionNotification(notification)) {
        if (
          !isDocument(notification.actor) ||
          !isDocument(notification.targetPost)
        ) {
          throw new Error('Actor or target post is not populated');
        }

        if (
          notification.targetPost.postType !== 'moment' &&
          notification.targetPost.postType !== 'sprint-result'
        ) {
          throw new Error('Post type is not moment or sprint-result');
        }

        return {
          ...notification.toJSON(),
          actor: notification.actor.toJSON(),
          targetPost: {
            ...notification.targetPost.toJSON(),
            postType: notification.targetPost.postType,
          },
          notificationType: 'post-reaction-notification',
          createdAt: notification.createdAt!.toJSON(),
        } satisfies PostReactionNotification;
      }

      if (Notification.isCommentCommentNotification(notification)) {
        if (
          !isDocument(notification.actor) ||
          !isDocument(notification.comment) ||
          !isDocument(notification.targetComment) ||
          !isDocument(notification.targetPost)
        ) {
          throw new Error(
            'Actor, comment, target comment or target post is not populated',
          );
        }

        return {
          ...notification.toJSON(),
          actor: notification.actor.toJSON(),
          comment: notification.comment.toJSON(),
          targetComment: notification.targetComment.toJSON(),
          targetPost: {
            ...notification.targetPost.toJSON(),
          },
          notificationType: 'comment-comment-notification',
          createdAt: notification.createdAt!.toJSON(),
        } satisfies CommentCommentNotification;
      }

      if (Notification.isCommentReactionNotification(notification)) {
        if (
          !isDocument(notification.actor) ||
          !isDocument(notification.targetComment) ||
          !isDocument(notification.targetPost)
        ) {
          throw new Error(
            'Actor, target comment or target post is not populated',
          );
        }

        return {
          ...notification.toJSON(),
          actor: notification.actor.toJSON(),
          targetComment: notification.targetComment.toJSON(),
          notificationType: 'comment-reaction-notification',
          createdAt: notification.createdAt!.toJSON(),
          targetPost: {
            ...notification.targetPost.toJSON(),
          },
        } satisfies CommentReactionNotification;
      }

      if (Notification.isCommunityInvitationNotification(notification)) {
        if (
          !isDocument(notification.actor) ||
          !isDocument(notification.community)
        ) {
          throw new Error('Actor or community is not populated');
        }

        return {
          ...notification.toJSON(),
          actor: notification.actor.toJSON(),
          notificationType: 'community-invitation-notification',
          createdAt: notification.createdAt!.toJSON(),
          community: notification.community.toJSON(),
        } satisfies CommunityInvitationNotification;
      }

      throw new Error('Notification type is not recognized');
    }) satisfies GetMyNotificationsResponse,
  );
}
