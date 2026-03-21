import {prop, plugin, Ref} from '@typegoose/typegoose';
import {User} from '../User.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Post} from './Post.js';

@plugin(AclTreePlugin<OnboardingCompleted>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class OnboardingCompleted extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;
}
