import {prop, type Ref} from '@typegoose/typegoose';
import {Reaction} from '../Reaction.js';
import {Post} from '../Post/Post.js';
import {User} from '../User.js';
import {Notification} from './Notification.js';

export class PostReactionNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Post, required: true, index: true})
  public targetPost: Ref<Post>;

  @prop({ref: () => Reaction, required: true})
  public reaction: Ref<Reaction>;
}
