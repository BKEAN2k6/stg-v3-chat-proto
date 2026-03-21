import {prop, type Ref} from '@typegoose/typegoose';
import {Community} from '../Community.js';
import {User} from '../User.js';
import {Notification} from './Notification.js';

export class CommunityInvitationNotification extends Notification {
  @prop({ref: () => User, required: true})
  public actor: Ref<User>;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;
}
