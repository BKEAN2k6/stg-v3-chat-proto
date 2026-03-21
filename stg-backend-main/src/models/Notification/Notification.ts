import type mongoose from 'mongoose';
import {
  prop,
  modelOptions,
  index,
  type Ref,
  type DocumentType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {User} from '../User';
import {type PostCommentNotification} from './PostCommentNotification';

function checkNotificationClass<T extends Notification>(
  document: Record<string, any>,
  name: string,
): document is DocumentType<T> {
  return document?.postType === name;
}

@modelOptions({
  schemaOptions: {
    collection: 'notifications',
    discriminatorKey: 'notificationType',
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

  @prop({ref: () => User, required: true})
  public user: Ref<User>;

  @prop({required: true})
  public notificationType: string;

  @prop({required: true, default: false})
  public isRead: boolean;

  public _id: mongoose.Types.ObjectId;
}
