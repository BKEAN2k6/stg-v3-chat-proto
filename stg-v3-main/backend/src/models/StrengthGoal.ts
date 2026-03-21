import {
  modelOptions,
  index,
  prop,
  type Ref,
  PropType,
  plugin,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {StrengthSlug} from '../api/client/ApiTypes.js';
import {User} from './User.js';
import {Group} from './Group.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

class StrengthGoalEvent {
  @prop({required: true, default: () => new Date(), type: Date})
  public createdAt: Date;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;
}
@plugin(AclTreePlugin<StrengthGoal>, {
  parent: 'group',
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
@index({group: 1, strength: 1})
export class StrengthGoal extends TimeStamps {
  @prop({type: String})
  public description: string;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, type: String})
  public strength: StrengthSlug;

  @prop({type: () => StrengthGoalEvent, default: []}, PropType.ARRAY)
  public events: StrengthGoalEvent[];

  @prop({required: true, type: Number})
  public target: number;

  @prop({required: true, type: Date})
  public targetDate: Date;

  @prop({required: true, default: false, type: Boolean})
  public isSystemCreated: boolean;

  @prop({ref: () => Group, required: true})
  public group: Ref<Group>;

  id: string;
}
