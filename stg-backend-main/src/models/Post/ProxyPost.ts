import mongoose from 'mongoose';
import {prop, pre, post, Ref} from '@typegoose/typegoose';
import {Post} from './Post';

@pre<ProxyPost>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.community._id.toHexString();
  await mongoose.model('AclItem').create({
    resourceId,
    parent,
  });
})
@post<ProxyPost>(
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
export class ProxyPost extends Post {
  @prop({ref: () => Post, required: true, index: true})
  public postReference: Ref<Post>;
}
