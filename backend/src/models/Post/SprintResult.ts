import {prop, Ref, PropType, plugin} from '@typegoose/typegoose';
import {type StrengthSlug} from '../../api/client/ApiTypes.js';
import {User} from '../User.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Post} from './Post.js';

class Strength {
  @prop({required: true, type: String})
  public strength: StrengthSlug;

  @prop({required: true, type: Number})
  public count: number;
}
@plugin(AclTreePlugin<SprintResult>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class SprintResult extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, type: String})
  public groupName: string;

  @prop({default: [], required: true, type: () => Strength}, PropType.ARRAY)
  public strengths: Strength[];
}
