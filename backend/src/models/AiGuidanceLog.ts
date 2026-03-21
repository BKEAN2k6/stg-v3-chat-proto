import {index, modelOptions, prop, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {AgeGroup, LanguageCode} from '../api/client/ApiTypes.js';
import {User} from './User.js';
import {Group} from './Group.js';
import {Community} from './Community.js';

@modelOptions({
  schemaOptions: {
    toJSON: {virtuals: true},
  },
})
@index({group: 1, createdAt: -1})
export class AiGuidanceLog extends TimeStamps {
  @prop({ref: () => User, required: true, index: true})
  public user: Ref<User>;

  @prop({ref: () => Group, required: true})
  public group: Ref<Group>;

  @prop({ref: () => Community, required: true, index: true})
  public community: Ref<Community>;

  @prop({required: true, type: String})
  public title: string;

  @prop({required: true, type: String})
  public suggestionText: string;

  @prop({required: true, type: String})
  public prompt: string;

  @prop({required: true, type: String})
  public response: string;

  @prop({required: true, type: String})
  public ageGroup: AgeGroup;

  @prop({required: true, type: String})
  public language: LanguageCode;

  @prop({required: true, type: String, default: 'none'})
  public action: 'none' | 'action' | 'refresh';

  @prop({type: Number, default: 0})
  public promptTokens: number;

  @prop({type: Number, default: 0})
  public completionTokens: number;

  @prop({type: Number, default: 0})
  public totalTokens: number;

  id: string;
}
