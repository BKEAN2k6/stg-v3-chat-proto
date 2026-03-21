import {prop, modelOptions} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {LanguageCode} from '../api/client/ApiTypes.js';

@modelOptions({schemaOptions: {_id: false}})
export class QuizTranslation {
  @prop({required: true, type: String})
  language: LanguageCode;

  @prop({required: true, type: String})
  text: string;
}

export class QuizQuestionChoice {
  @prop({type: () => [QuizTranslation], required: true})
  label: QuizTranslation[];

  @prop({required: true, type: Boolean})
  isCorrect: boolean;

  @prop({required: true, type: Number})
  points: number;

  _id: mongoose.Types.ObjectId;
}

export class QuizQuestion {
  @prop({type: () => [QuizTranslation], required: true})
  instruction: QuizTranslation[];

  @prop({type: () => [QuizTranslation], required: true})
  explanation: QuizTranslation[];

  @prop({type: String, required: false})
  strength: StrengthSlug | undefined;

  @prop({
    type: () => [QuizQuestionChoice],
    required: true,
  })
  choices: QuizQuestionChoice[];

  @prop({required: true, type: Boolean})
  multiSelect: boolean;

  _id: mongoose.Types.ObjectId;
}

@modelOptions({schemaOptions: {timestamps: true}})
export class QuizQuestionSet {
  @prop({type: () => [QuizTranslation], required: true})
  title: QuizTranslation[];

  @prop({type: () => [QuizTranslation], required: true})
  description: QuizTranslation[];

  @prop({required: true, type: String})
  public type: 'quiz' | 'questionnaire';

  @prop({
    type: () => [QuizQuestion],
    required: true,
  })
  questions: QuizQuestion[];

  _id: mongoose.Types.ObjectId;
}
