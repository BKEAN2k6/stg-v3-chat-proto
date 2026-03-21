import mongoose from 'mongoose';
import {prop, modelOptions} from '@typegoose/typegoose';

@modelOptions({schemaOptions: {_id: false}})
export class ArticleCategoryTranslation {
  @prop({required: true, type: String, enum: ['en', 'fi', 'sv']})
  public language: 'en' | 'fi' | 'sv';

  @prop({required: true})
  public name: string;

  @prop({required: true})
  public description: string;
}

export class ArticleCategory {
  @prop({})
  public parentCategory: mongoose.Types.ObjectId;

  @prop({required: true, index: true})
  public rootCategory: mongoose.Types.ObjectId;

  @prop()
  public thumbnail: string;

  @prop({required: true, type: String, enum: ['list', 'grid']})
  public displayAs: 'list' | 'grid';

  @prop({
    type: ArticleCategoryTranslation,
    required: true,
    default: [],
    validate: {
      validator(translations: ArticleCategoryTranslation[]) {
        return translations.length > 0;
      },
      message: 'At least one translation is required',
    },
  })
  public translations: mongoose.Types.Array<ArticleCategoryTranslation>;

  @prop({required: true})
  public order: number;

  @prop({required: true})
  public isHidden: boolean;

  @prop({required: true})
  public isLocked: boolean;

  public _id: mongoose.Types.ObjectId;
}
