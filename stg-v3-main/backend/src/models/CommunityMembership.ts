import {modelOptions, prop, index, type Ref} from '@typegoose/typegoose';
import {Community} from './Community.js';
import {User} from './User.js';

@index({community: 1, user: 1, role: 1}, {unique: true})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class CommunityMembership {
  @prop({ref: () => Community, index: true, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public user: Ref<User>;

  @prop({required: true, type: String})
  public role: 'admin' | 'member' | 'owner';

  id: string;
}
