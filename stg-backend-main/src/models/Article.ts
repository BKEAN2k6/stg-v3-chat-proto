import mongoose from 'mongoose';
import {prop, modelOptions, Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {type StrengthSlug} from '../api/client/ApiTypes';
import {User} from './User';

@modelOptions({schemaOptions: {_id: false}})
export class ArticleTranslation {
  @prop({required: true})
  public language: string;

  @prop({required: true})
  public description: string;

  @prop({required: true})
  public title: string;

  @prop({type: String, required: true, default: []})
  public content: mongoose.Types.Array<string>;
}

export class Article extends TimeStamps {
  @prop({
    type: ArticleTranslation,
    required: true,
    default: [],
    validate: {
      validator(translations: ArticleTranslation[]) {
        return translations.length > 0;
      },
      message: 'At least one translation is required',
    },
  })
  public translations: mongoose.Types.Array<ArticleTranslation>;

  @prop({type: String, required: true, default: []})
  public tags: mongoose.Types.Array<string>;

  @prop({})
  public thumbnail: string;

  @prop({required: true})
  public length: string;

  @prop({type: String, required: true, default: []})
  public strengths: mongoose.Types.Array<StrengthSlug>;

  @prop({index: true, required: true})
  public category: mongoose.Types.ObjectId;

  @prop({index: true, required: true})
  public rootCategory: mongoose.Types.ObjectId;

  @prop({required: true})
  public order: number;

  @prop({ref: () => User, required: true})
  public updatedBy: Ref<User>;

  @prop({required: true})
  public isHidden: boolean;

  @prop({required: true})
  public isLocked: boolean;

  public _id: mongoose.Types.ObjectId;
}
