import mongoose from 'mongoose';
import {
  prop,
  pre,
  post,
  type Ref,
  type DocumentType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {Group} from './Group'; // eslint-disable-line import/no-cycle

const aclRoles = {
  member: 'community-member',
  admin: 'community-admin',
};

@pre<Community>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const resourceId = this._id.toHexString();
  await mongoose.model('AclItem').create({resourceId});
})
@post<Community>(
  'deleteOne',
  async function () {
    const resourceId: mongoose.Types.ObjectId = this.getFilter()
      ._id as mongoose.Types.ObjectId;
    if (!resourceId) {
      throw new Error('Query _id is undefined');
    }

    await mongoose.model('AclItem').deleteOne({resourceId});
  },
  {document: false, query: true},
)
export class Community extends TimeStamps {
  @prop({required: true})
  public name: string;

  @prop({default: ''})
  public description: string;

  @prop({default: ''})
  public avatar: string;

  @prop({required: true, default: 'en'})
  public language: string;

  @prop({ref: () => Group, default: []})
  public groups: Array<Ref<Group>>;

  @prop({required: true, default: 'Etc/GMT'})
  public timezone: string;

  public _id: mongoose.Types.ObjectId;

  public async upsertMemberAndSave(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
    role: 'member' | 'admin',
  ) {
    await mongoose
      .model('CommunityMembership')
      .findOneAndUpdate({community: this._id, user}, {role}, {upsert: true});

    const resourceId = this._id.toHexString();
    await mongoose
      .model('AclItem')
      .updateOne({resourceId}, {$pull: {roles: {user}}});
    await mongoose
      .model('AclItem')
      .updateOne(
        {resourceId},
        {$addToSet: {roles: {user, role: aclRoles[role]}}},
      );

    await this.save();
  }

  public async removeMemberAndSave(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
  ) {
    const resourceId = this._id.toHexString();
    await mongoose
      .model('AclItem')
      .updateOne({resourceId}, {$pull: {roles: {user}}});

    await mongoose.model('CommunityMembership').deleteOne({
      community: this._id,
      user,
    });

    await this.save();
  }

  public async isMember(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
  ) {
    const membership = await mongoose
      .model('CommunityMembership')
      .findOne({community: this._id, user});
    return Boolean(membership);
  }
}
