import type mongoose from 'mongoose';
import {prop, index, type Ref} from '@typegoose/typegoose';
import {Community} from './Community';
import {User} from './User';

@index({community: 1, user: 1, role: 1}, {unique: true})
export class CommunityMembership {
  @prop({ref: () => Community, index: true, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public user: Ref<User>;

  @prop({required: true})
  public role: 'admin' | 'member';

  public _id: mongoose.Types.ObjectId;
}
