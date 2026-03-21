import {prop, pre, type Ref} from '@typegoose/typegoose';
import {Community} from './Community';
import {User} from './User';

@pre<CommunityInvitation>('validate', function () {
  if (!this.isNew) {
    return;
  }

  this.code = Math.floor(100_000 + Math.random() * 900_000).toString();
})
export class CommunityInvitation {
  @prop({index: true, unique: true})
  public code: string;

  @prop({ref: () => Community, index: true})
  public community: Ref<Community>;

  @prop({ref: () => User})
  public createdBy: Ref<User>;

  @prop({expires: 60 * 60 * 21 * 24, default: Date.now})
  public createdAt: Date;
}
