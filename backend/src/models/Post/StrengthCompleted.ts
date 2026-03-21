import {prop, Ref, plugin} from '@typegoose/typegoose';
import {type StrengthSlug} from '../../api/client/ApiTypes.js';
import {User} from '../User.js';
import {Group} from '../Group.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Post} from './Post.js';

@plugin(AclTreePlugin<StrengthCompleted>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class StrengthCompleted extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => Group, required: true})
  public group: Ref<Group>;

  @prop({type: String, required: true})
  public strength: StrengthSlug;
}
