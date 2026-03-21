import mongoose from 'mongoose';
import {modelOptions, prop, plugin, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import MongooseDelete from 'mongoose-delete';
import {User} from './User.js';
import {Community} from './Community.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

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

@plugin(AclTreePlugin<Reaction>, {
  parent: 'target',
  roles: [{userPath: 'createdBy', role: 'reaction-owner'}],
})
@plugin(MongooseDelete, {overrideMethods: true})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Reaction extends SofDelete {
  @prop({index: true, required: true, type: mongoose.Types.ObjectId})
  public rootTarget: mongoose.Types.ObjectId;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public target: mongoose.Types.ObjectId;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, index: true, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, type: String})
  public type: ReactionStength;

  id: string;
}
