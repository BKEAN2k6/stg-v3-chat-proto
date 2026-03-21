import mongoose from 'mongoose';
import {prop, pre, post, type Ref} from '@typegoose/typegoose';
import {type StrengthSlug} from '../../api/client/ApiTypes';
import {UserImage} from '../UserImage';
import {Group} from '../Group';
import {User} from '../User';
import {Post} from './Post';

@pre<Moment>('save', async function () {
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
@post<Moment>(
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
export class Moment extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => UserImage, default: []})
  public images: Array<Ref<UserImage>>;

  @prop({default: ''})
  public content: string;

  @prop({ref: () => Group, default: []})
  public groups: Array<Ref<Group>>;

  @prop({ref: () => User, default: []})
  public users: Array<Ref<User>>;

  @prop({type: String, required: true, default: []})
  public strengths: mongoose.Types.Array<StrengthSlug>;
}
