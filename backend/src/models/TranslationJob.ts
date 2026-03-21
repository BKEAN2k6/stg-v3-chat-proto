import {modelOptions, prop, index, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {LanguageCode} from '../api/client/ApiTypes.js';
import {User} from './User.js';

class TranslationSource {
  @prop({type: String})
  public title: string;

  @prop({type: String})
  public description: string;

  @prop({type: [String]})
  public content: string[];
}

class TranslationResult {
  @prop({type: String})
  public title: string;

  @prop({type: String})
  public description: string;

  @prop({type: [String]})
  public content: string[];

  @prop({type: String})
  public language: LanguageCode;
}

@index({createdAt: 1}, {expireAfterSeconds: 60 * 60 * 24 * 2})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class TranslationJob extends TimeStamps {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, default: false, type: Boolean})
  public isFinished: boolean;

  @prop({required: true, type: String})
  public prompt: string;

  @prop({required: true, type: String})
  public source: TranslationSource;

  @prop({required: true, type: String})
  public targetLanguage: string;

  @prop({type: String})
  public rawResult: string;

  @prop({type: String})
  public errorMessage: string;

  @prop({type: TranslationResult})
  public result: TranslationResult;

  id: string;
}
