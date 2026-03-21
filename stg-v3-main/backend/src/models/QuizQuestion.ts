import mongoose from 'mongoose';
import {prop, modelOptions} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {LanguageCode, AgeGroup, StrengthSlug} from '../api/client/ApiTypes.js';

@modelOptions({schemaOptions: {_id: false}})
export class QuizQuestionTranslation {
  @prop({required: true, type: String})
  public language: LanguageCode;

  @prop({required: true, type: String})
  public question: string;

  @prop({required: true, type: String})
  public explanation: string;
}
export class QuizQuestionChoiseTranslation {
  @prop({required: true, type: String})
  language: LanguageCode;

  @prop({required: true, type: String})
  text: string;
}

export class QuizQuestionChoise {
  @prop({required: true, type: mongoose.Types.ObjectId})
  _id: mongoose.Types.ObjectId;

  @prop({
    type: QuizQuestionChoiseTranslation,
    required: true,
    default: [],
  })
  translations: mongoose.Types.Array<QuizQuestionChoiseTranslation>;

  @prop({required: true, type: Boolean})
  isCorrect: boolean;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class QuizQuestion extends TimeStamps {
  @prop({
    type: QuizQuestionTranslation,
    required: true,
    default: [],
  })
  translations: mongoose.Types.Array<QuizQuestionTranslation>;

  @prop({type: () => [QuizQuestionChoise], required: true, default: []})
  choices: QuizQuestionChoise[];

  @prop({required: true, type: String})
  ageGroup: AgeGroup;

  @prop({required: true, type: String})
  strength: StrengthSlug;

  @prop({required: true, type: Boolean})
  isReady: boolean;

  id: string;
}
