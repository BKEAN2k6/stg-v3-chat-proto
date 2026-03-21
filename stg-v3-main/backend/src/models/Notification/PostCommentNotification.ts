import {prop, type Ref} from '@typegoose/typegoose';
import {Post} from '../Post/Post.js';
import {Comment} from '../Comment.js';
import {User} from '../User.js';
import {Notification} from './Notification.js';

export class PostCommentNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Post, required: true, index: true})
  public targetPost: Ref<Post>;

  @prop({ref: () => Comment, required: true})
  public comment: Ref<Comment>;
}
