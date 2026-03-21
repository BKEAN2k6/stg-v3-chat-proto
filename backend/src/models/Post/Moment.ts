import mongoose from 'mongoose';
import {prop, type Ref, PropType, plugin} from '@typegoose/typegoose';
import {type StrengthSlug} from '../../api/client/ApiTypes.js';
import {UserImage} from '../UserImage.js';
import {Group} from '../Group.js';
import {User} from '../User.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Post} from './Post.js';

@plugin(AclTreePlugin<Moment>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class Moment extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => UserImage, default: []}, PropType.ARRAY)
  public images: Array<Ref<UserImage>>;

  @prop({default: '', type: String})
  public content: string;

  @prop({ref: () => Group, default: []}, PropType.ARRAY)
  public groups: Array<Ref<Group>>;

  @prop({ref: () => User, default: []}, PropType.ARRAY)
  public users: Array<Ref<User>>;

  @prop({type: String, required: true, default: []}, PropType.ARRAY)
  public strengths: mongoose.Types.Array<StrengthSlug>;
}
