import {
  prop,
  modelOptions,
  index,
  type Ref,
  type DocumentType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from '../User.js';
import {type PostCommentNotification} from './PostCommentNotification.js';
import {type PostReactionNotification} from './PostReactionNotification.js';
import {type CommentReactionNotification} from './CommentReactionNotification.js';
import {type CommentCommentNotification} from './CommentCommentNotification.js';
import {type CommunityInvitationNotification} from './CommunityInvitationNotification.js';

function checkNotificationClass<T extends Notification>(
  document: Record<string, any>,
  name: string,
): document is DocumentType<T> {
  return document?.notificationType === name;
}

@modelOptions({
  schemaOptions: {
    collection: 'notifications',
    discriminatorKey: 'notificationType',
    toJSON: {
      virtuals: true,
    },
  },
})
@index({user: 1, createdAt: -1})
export class Notification extends TimeStamps {
  public static isPostCommentNotification(
    document: Record<string, any>,
  ): document is DocumentType<PostCommentNotification> {
    return checkNotificationClass<PostCommentNotification>(
      document,
      'post-comment-notification',
    );
  }

  public static isPostReactionNotification(
    document: Record<string, any>,
  ): document is DocumentType<PostReactionNotification> {
    return checkNotificationClass<PostReactionNotification>(
      document,
      'post-reaction-notification',
    );
  }

  public static isCommentReactionNotification(
    document: Record<string, any>,
  ): document is DocumentType<CommentReactionNotification> {
    return checkNotificationClass<CommentReactionNotification>(
      document,
      'comment-reaction-notification',
    );
  }

  public static isCommentCommentNotification(
    document: Record<string, any>,
  ): document is DocumentType<CommentCommentNotification> {
    return checkNotificationClass<CommentCommentNotification>(
      document,
      'comment-comment-notification',
    );
  }

  public static isCommunityInvitationNotification(
    document: Record<string, any>,
  ): document is DocumentType<CommunityInvitationNotification> {
    return checkNotificationClass<CommunityInvitationNotification>(
      document,
      'community-invitation-notification',
    );
  }

  @prop({ref: () => User, required: true})
  public user: Ref<User>;

  @prop({required: true, type: String})
  public notificationType: string;

  @prop({required: true, default: false, type: Boolean})
  public isRead: boolean;

  id: string;
}
