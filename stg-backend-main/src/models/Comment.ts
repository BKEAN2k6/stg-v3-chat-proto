import mongoose from 'mongoose';
import {prop, pre, post, plugin, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import MongooseDelete from 'mongoose-delete';
import {Community} from './Community';
import {UserImage} from './UserImage';
import {User} from './User';

abstract class SofDelete extends TimeStamps {
  public delete: () => Promise<void>;
}

@pre<Comment>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.target._id.toHexString();
  await mongoose.model('AclItem').create({
    resourceId,
    parent,
    roles: [{user: this.createdBy, role: 'comment-owner'}],
  });
})
@post<Comment>(
  'deleteOne',
  async function () {
    const resourceId: mongoose.Types.ObjectId = this.getFilter()
      ._id as mongoose.Types.ObjectId;
    if (!resourceId) {
      throw new Error('Query _id is not found.');
    }

    await mongoose.model('AclItem').deleteOne({resourceId});
  },
  {document: false, query: true},
)
@plugin(MongooseDelete, {overrideMethods: true})
export class Comment extends SofDelete {
  public static MAX_LEVEL = 2;
  public static MAX_COMMENTS = 1000;

  @prop({index: true, required: true})
  public rootTarget: mongoose.Types.ObjectId;

  @prop({required: true})
  public target: mongoose.Types.ObjectId;

  @prop({required: true, min: 0, max: Comment.MAX_LEVEL})
  public level: number;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public createdBy: Ref<User>;

  @prop({default: ''})
  public content: string;

  @prop({ref: () => UserImage, default: []})
  public images: Array<Ref<UserImage>>;

  public _id: mongoose.Types.ObjectId;
}
