import {prop, Ref, PropType} from '@typegoose/typegoose';
import {User} from './User.js';

class RolesItem {
  @prop({ref: () => User, index: true, required: true})
  public user: Ref<User>;

  @prop({type: String})
  role: string;
}

export class AclItem {
  @prop({index: true, unique: true, type: String})
  public resourceId: string;

  @prop({default: [], type: [RolesItem]}, PropType.ARRAY)
  public roles: RolesItem[];

  @prop({type: String})
  public parent?: string;

  id: string;
}
