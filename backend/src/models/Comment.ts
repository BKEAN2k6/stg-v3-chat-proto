import mongoose from 'mongoose';
import {
  prop,
  plugin,
  type Ref,
  modelOptions,
  PropType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import MongooseDelete from 'mongoose-delete';
import {Community} from './Community.js';
import {UserImage} from './UserImage.js';
import {User} from './User.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

abstract class SofDelete extends TimeStamps {
  public delete: () => Promise<void>;
}

@plugin(AclTreePlugin<Comment>, {
  parent: 'target',
  roles: [{userPath: 'createdBy', role: 'comment-owner'}],
})
@plugin(MongooseDelete, {overrideMethods: true})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Comment extends SofDelete {
  public static MAX_LEVEL = 2;
  public static MAX_COMMENTS = 1000;

  @prop({index: true, required: true, type: mongoose.Types.ObjectId})
  public rootTarget: mongoose.Types.ObjectId;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public target: mongoose.Types.ObjectId;

  @prop({required: true, min: 0, max: Comment.MAX_LEVEL, type: Number})
  public level: number;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public createdBy: Ref<User>;

  @prop({default: '', type: String})
  public content: string;

  @prop({ref: () => UserImage, default: []}, PropType.ARRAY)
  public images: Array<Ref<UserImage>>;

  id: string;
}
