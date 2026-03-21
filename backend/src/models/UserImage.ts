import {modelOptions, prop, type Ref, plugin} from '@typegoose/typegoose';
import {Community} from './Community.js';
import {User} from './User.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

@plugin(AclTreePlugin<UserImage>, {
  parent: 'community',
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class UserImage {
  @prop({ref: () => Community, index: true, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, type: String})
  public originalImageUrl: string;

  @prop({required: true, type: String})
  public resizedImageUrl: string;

  @prop({required: true, type: String})
  public thumbnailImageUrl: string;

  @prop({required: true, type: Number})
  public aspectRatio: number;

  id: string;
}
