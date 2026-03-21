import mongoose from 'mongoose';
import {prop, pre, post, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {Community} from './Community'; // eslint-disable-line import/no-cycle

@pre<Group>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.community._id.toHexString();
  await mongoose.model('AclItem').create({resourceId, parent});
})
@post<Group>(
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
export class Group extends TimeStamps {
  @prop({required: true})
  public name: string;

  @prop()
  public description?: string;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  public _id: mongoose.Types.ObjectId;
}
