import {modelOptions, prop, type Ref, plugin} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {Community} from './Community.js';
import {User} from './User.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

@plugin(AclTreePlugin<CommunityMemberInvitation>, {
  parent: 'community',
  roles: [{userPath: 'user', role: 'invited-user'}],
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class CommunityMemberInvitation extends TimeStamps {
  @prop({ref: () => Community, required: true, index: true})
  public community: Ref<Community>;

  @prop({ref: () => User, required: true, index: true})
  public user: Ref<User>;

  @prop({ref: () => User})
  public createdBy: Ref<User>;

  @prop({default: '', type: String})
  public message: string;

  id: string;
}
