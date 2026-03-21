import {prop, type Ref} from '@typegoose/typegoose';
import {Comment} from '../Comment';
import {Post} from '../Post/Post';
import {User} from '../User';
import {Notification} from './Notification';

export class CommentCommentNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Comment, required: true, index: true})
  public targetComment: Ref<Comment>;

  @prop({ref: () => Post, required: true, index: true})
  public targetPost: Ref<Post>;

  @prop({ref: () => Comment, required: true})
  public comment: Ref<Comment>;
}
