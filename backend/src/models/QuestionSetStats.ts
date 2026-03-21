import mongoose from 'mongoose';
import {prop, modelOptions, index, Ref, PropType} from '@typegoose/typegoose';
import {QuizQuestionSet} from './QuizQuestionSet.js';

@modelOptions({schemaOptions: {_id: false}})
export class StrengthAggregate {
  @prop({required: true, default: 0, type: Number})
  mean: number;

  @prop({required: true, default: 0, type: Number})
  stdDev: number;

  @prop({required: true, default: 0, type: Number})
  count: number;
}

export class QuestionStats {
  @prop({required: true, type: mongoose.Schema.Types.ObjectId})
  question: mongoose.Types.ObjectId;

  @prop({required: true, default: 0, type: Number})
  totalResponses: number;

  @prop({required: true, default: 0, type: Number})
  mean: number;

  @prop({required: true, default: 0, type: Number})
  m2: number;

  @prop(
    {type: () => Number, default: () => new Map<string, number>()},
    PropType.MAP,
  )
  choicesCount: Map<string, number>;

  @prop({required: true, default: () => new Date(), type: Date})
  lastUpdated: Date;

  _id: mongoose.Types.ObjectId;
}

@modelOptions({schemaOptions: {timestamps: true}})
@index({questionSet: 1}, {unique: true})
export class QuestionSetStats {
  @prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: () => QuizQuestionSet,
  })
  questionSet: Ref<QuizQuestionSet>;

  @prop({required: true, default: 0, type: Number})
  totalCompletedSessions: number;

  @prop({required: true, type: () => [QuestionStats], default: []})
  questions: QuestionStats[];

  @prop(
    {
      type: () => StrengthAggregate,
      default: () => new Map<string, StrengthAggregate>(),
    },
    PropType.MAP,
  )
  strengthAverages?: Map<string, StrengthAggregate>;

  @prop({required: true, default: () => new Date(), type: Date})
  lastUpdated: Date;

  _id: mongoose.Types.ObjectId;
}
