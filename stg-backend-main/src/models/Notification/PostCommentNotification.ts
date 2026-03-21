import {prop, type Ref} from '@typegoose/typegoose';
import {Post} from '../Post/Post';
import {Comment} from '../Comment';
import {User} from '../User';
import {Notification} from './Notification';

export class PostCommentNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Post, required: true, index: true})
  public targetPost: Ref<Post>;

  @prop({ref: () => Comment, required: true})
  public comment: Ref<Comment>;
}
