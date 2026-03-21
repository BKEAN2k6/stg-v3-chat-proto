import mongoose from 'mongoose';
import {prop, pre, post, Ref} from '@typegoose/typegoose';
import {type StrengthSlug} from '../../api/client/ApiTypes';
import {User} from '../User';
import {Post} from './Post';

class Strength {
  @prop({required: true})
  public strength: StrengthSlug;

  @prop({required: true})
  public count: number;
}

@pre<SprintResult>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.community._id.toHexString();
  await mongoose.model('AclItem').create({
    resourceId,
    parent,
    roles: [{user: this.createdBy, role: 'post-owner'}],
  });
})
@post<SprintResult>(
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
export class SprintResult extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({type: [Strength], required: true, default: []})
  public strengths: mongoose.Types.Array<Strength>;
}
