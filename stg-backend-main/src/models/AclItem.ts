import type mongoose from 'mongoose';
import {prop, Ref} from '@typegoose/typegoose';
import {User} from './User';

class RolesItem {
  @prop({ref: () => User, index: true, required: true})
  public user: Ref<User>;

  @prop()
  role: string;
}

export class AclItem {
  @prop({index: true, unique: true})
  public resourceId: string;

  @prop({default: [], type: [RolesItem]})
  public roles: RolesItem[];

  @prop()
  public parent?: string;

  public _id: mongoose.Types.ObjectId;
}
