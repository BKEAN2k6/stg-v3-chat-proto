import mongoose from 'mongoose';
import {prop, pre, post, type Ref} from '@typegoose/typegoose';
import {Community} from './Community';
import {User} from './User';

@pre<UserImage>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  const parent = this.community._id.toHexString();
  await mongoose.model('AclItem').create({resourceId, parent});
})
@post<UserImage>(
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
export class UserImage {
  @prop({ref: () => Community, index: true, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true})
  public originalImageUrl: string;

  @prop({required: true})
  public resizedImageUrl: string;

  @prop({required: true})
  public thumbnailImageUrl: string;

  @prop({required: true})
  public aspectRatio: number;

  public _id: mongoose.Types.ObjectId;
}
