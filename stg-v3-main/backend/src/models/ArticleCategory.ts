import mongoose from 'mongoose';
import {prop, modelOptions, PropType} from '@typegoose/typegoose';
import {LanguageCode} from '../api/client/ApiTypes.js';

@modelOptions({schemaOptions: {_id: false}})
export class ArticleCategoryTranslation {
  @prop({required: true, type: String})
  public language: LanguageCode;

  @prop({required: true, type: String})
  public name: string;

  @prop({required: true, type: String})
  public description: string;

  @prop({type: String})
  public thumbnail: string;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class ArticleCategory {
  @prop({type: mongoose.Types.ObjectId})
  public parentCategory: mongoose.Types.ObjectId;

  @prop({required: true, index: true, type: mongoose.Types.ObjectId})
  public rootCategory: mongoose.Types.ObjectId;

  @prop({type: String})
  public thumbnail: string;

  @prop({required: true, type: String, enum: ['list', 'grid']})
  public displayAs: 'list' | 'grid';

  @prop(
    {
      type: () => [ArticleCategoryTranslation],
      required: true,
      default: [],
      validate: {
        validator(translations: ArticleCategoryTranslation[]) {
          return translations.length > 0;
        },
        message: 'At least one translation is required',
      },
    },
    PropType.ARRAY,
  )
  public translations: ArticleCategoryTranslation[];

  @prop({required: true, type: Number})
  public order: number;

  @prop({required: true, type: Boolean})
  public isHidden: boolean;

  @prop({required: true, type: Boolean})
  public isLocked: boolean;

  id: string;
}
