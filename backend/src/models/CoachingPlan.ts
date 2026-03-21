import {modelOptions, prop, Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from './User.js';
import {CoachingBasePrompt} from './CoachingBasePrompt.js';

@modelOptions({
  schemaOptions: {
    toJSON: {virtuals: true},
  },
})
export class CoachingPlan extends TimeStamps {
  @prop({required: true, type: String})
  public title: string;

  @prop({required: true, type: String})
  public description: string;

  @prop({required: true, type: String})
  public content: string;

  @prop({ref: () => CoachingBasePrompt, required: true})
  public basePrompt: Ref<CoachingBasePrompt>;

  @prop({required: true, type: Boolean, default: false})
  public isPublished: boolean;

  @prop({required: true, type: Number, default: 0})
  public order: number;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => User, required: true})
  public updatedBy: Ref<User>;

  id: string;
}
