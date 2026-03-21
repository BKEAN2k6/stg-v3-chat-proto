import {prop, Ref, plugin} from '@typegoose/typegoose';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Post} from './Post.js';

@plugin(AclTreePlugin<ProxyPost>, {
  parent: 'community',
})
export class ProxyPost extends Post {
  @prop({ref: () => Post, required: true, index: true})
  public postReference: Ref<Post>;
}
