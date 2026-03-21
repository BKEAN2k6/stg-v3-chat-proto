import mongoose from 'mongoose';
import {prop, modelOptions, Ref, plugin, PropType} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {
  AgeGroup,
  ArticleChapter,
  LanguageCode,
  type StrengthSlug,
} from '../api/client/ApiTypes.js';
import {User} from './User.js';
import historyPlugin, {
  HistoryDocument,
} from './plugins/history/historyPlugin.js';

@modelOptions({schemaOptions: {_id: false}})
export class ArticleTranslation {
  @prop({required: true, type: String})
  public language: LanguageCode;

  @prop({required: true, type: String})
  public description: string;

  @prop({required: true, type: String})
  public title: string;

  @prop({default: [], required: true, type: () => [String]}, PropType.ARRAY)
  public content: string[];

  @prop({type: String})
  public thumbnail: string;

  @prop({type: Boolean, required: true, default: false})
  public requiresUpdate: boolean;
}
@plugin(historyPlugin)
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Article extends TimeStamps {
  static getHistoryById: (
    id: string | mongoose.Types.ObjectId,
  ) => Promise<HistoryDocument>;

  @prop(
    {
      type: () => [ArticleTranslation],
      required: true,
      default: [],
      validate: {
        validator(translations: ArticleTranslation[]) {
          return Array.isArray(translations) && translations.length > 0;
        },
        message: 'At least one translation is required',
      },
    },
    PropType.ARRAY,
  )
  public translations: ArticleTranslation[];

  @prop({default: [], required: true, type: () => [String]}, PropType.ARRAY)
  public tags: string[];

  @prop({type: String})
  public thumbnail: string;

  @prop({required: true, type: String})
  public length: string;

  @prop({default: [], required: true, type: () => [String]}, PropType.ARRAY)
  public strengths: StrengthSlug[];

  @prop({index: true, required: true, type: mongoose.Types.ObjectId})
  public category: mongoose.Types.ObjectId;

  @prop({index: true, required: true, type: mongoose.Types.ObjectId})
  public rootCategory: mongoose.Types.ObjectId;

  @prop({required: true, type: Number})
  public order: number;

  @prop({ref: () => User, required: true})
  public updatedBy: Ref<User>;

  @prop({required: true, type: Boolean})
  public isHidden: boolean;

  @prop({required: true, type: Boolean})
  public isLocked: boolean;

  @prop({required: true, default: false, type: Boolean})
  public isFree: boolean;

  @prop({required: true, default: 'start', type: String})
  public articleType: ArticleChapter | 'undefined';

  @prop({required: true, default: false, index: true, type: Boolean})
  public isTimelineArticle: boolean;

  @prop({required: true, default: 'start', type: String})
  public timelineChapter: ArticleChapter;

  @prop({required: true, default: 'preschool', type: String})
  public timelineAgeGroup: AgeGroup;

  @prop({required: true, default: 'kindness', type: String})
  public timelineStrength: StrengthSlug;

  id: string;

  saveHistory: (changeLog: string) => Promise<void>;

  getHistory: () => Promise<HistoryDocument[]>;
}
