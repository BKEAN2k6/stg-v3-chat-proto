import {modelOptions, prop, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from './User.js';

@modelOptions({
  schemaOptions: {
    toJSON: {virtuals: true},
  },
})
export class CoachingBasePrompt extends TimeStamps {
  @prop({required: true, type: String})
  public name: string;

  @prop({required: true, type: String})
  public content: string;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => User, required: true})
  public updatedBy: Ref<User>;

  id: string;
}
