import {prop, type Ref} from '@typegoose/typegoose';
import {Reaction} from '../Reaction';
import {Post} from '../Post/Post';
import {User} from '../User';
import {Notification} from './Notification';

export class PostReactionNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Post, required: true, index: true})
  public targetPost: Ref<Post>;

  @prop({ref: () => Reaction, required: true})
  public reaction: Ref<Reaction>;
}
