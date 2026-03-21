import mongoose from 'mongoose';
import {prop, pre, post, plugin, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import MongooseDelete from 'mongoose-delete';
import {User} from './User';
import {Community} from './Community';

abstract class SofDelete extends TimeStamps {
  public delete: () => Promise<void>;
}

type ReactionStength =
  | 'like'
  | 'compassion'
  | 'courage'
  | 'creativity'
  | 'humour'
  | 'love'
  | 'perseverance';

@pre<Reaction>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.target.toHexString();
  await mongoose.model('AclItem').create({
    resourceId,
    parent,
    roles: [{user: this.createdBy, role: 'reaction-owner'}],
  });
})
@post<Reaction>(
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
export class Reaction extends SofDelete {
  @prop({index: true, required: true})
  public rootTarget: mongoose.Types.ObjectId;

  @prop({required: true})
  public target: mongoose.Types.ObjectId;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public createdBy: Ref<User>;

  @prop({required: true})
  public type: ReactionStength;

  public _id: mongoose.Types.ObjectId;
}
