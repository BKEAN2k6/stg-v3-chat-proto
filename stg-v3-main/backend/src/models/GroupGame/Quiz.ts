import mongoose from 'mongoose';
import {modelOptions, prop, PropType} from '@typegoose/typegoose';
import {QuizQuestionSet} from '../QuizQuestionSet.js';
import {QuestionSetStats} from '../index.js';
import {GroupGame} from './GroupGame.js';

export class QuizAnswer {
  @prop({required: true, type: mongoose.Types.ObjectId})
  public player: mongoose.Types.ObjectId;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public question: mongoose.Types.ObjectId;

  @prop({required: true, type: () => [mongoose.Types.ObjectId]})
  public choices: mongoose.Types.ObjectId[];

  public _id: mongoose.Types.ObjectId;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Quiz extends GroupGame {
  @prop({required: true, type: () => QuizQuestionSet})
  public questionSet: QuizQuestionSet;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public currentQuestion: mongoose.Types.ObjectId;

  @prop({required: true, default: true, type: Boolean})
  public canAnswer: boolean;

  @prop({default: [], required: true, type: () => [QuizAnswer]}, PropType.ARRAY)
  public answers: QuizAnswer[];

  // Keep your stats updater as-is, just extends the base now
  // eslint-disable-next-line complexity
  public async updateStats(this: mongoose.Document & Quiz) {
    const qMap = new Map<string, Array<{points: number; choiceId: string}>>();

    type QuestionType = (typeof this.questionSet.questions)[number];
    const questionLookup = new Map<string, QuestionType>();
    for (const q of this.questionSet.questions) {
      questionLookup.set(q._id.toJSON(), q);
    }

    for (const ans of this.answers) {
      const qid = ans.question.toJSON();
      const question = questionLookup.get(qid);
      if (!question) continue;

      const selectedChoices = Array.isArray(ans.choices) ? ans.choices : [];
      if (selectedChoices.length === 0) continue;

      for (const choiceObjectId of selectedChoices) {
        const choiceId = choiceObjectId.toJSON();
        const choice = question.choices.find(
          (c) => c._id.toJSON() === choiceId,
        );
        if (!choice) continue;

        if (!qMap.has(qid)) qMap.set(qid, []);
        qMap.get(qid)!.push({points: choice.points, choiceId});
      }
    }

    if (qMap.size === 0) return;

    const questionSetId = this.questionSet._id;
    let stats = await QuestionSetStats.findOne({
      questionSet: questionSetId,
    }).exec();

    const isNewStats = !stats;
    stats ??= new QuestionSetStats({
      questionSet: questionSetId,
      totalCompletedSessions: 0,
      questions: [],
      strengthAverages: {},
      lastUpdated: new Date(),
    });

    if (isNewStats || stats.questions.length === 0) {
      const questions: typeof stats.questions = [];
      for (const [qid, entries] of qMap.entries()) {
        let n = 0;
        let mean = 0;
        let m2 = 0;
        const choicesCount = new Map<string, number>();
        for (const {points: x, choiceId} of entries) {
          n += 1;
          const delta = x - mean;
          mean += delta / n;
          m2 += delta * (x - mean);
          choicesCount.set(choiceId, (choicesCount.get(choiceId) ?? 0) + 1);
        }

        questions.push({
          _id: new mongoose.Types.ObjectId(),
          question: new mongoose.Types.ObjectId(qid),
          totalResponses: n,
          mean,
          m2,
          choicesCount,
          lastUpdated: new Date(),
        });
      }

      stats.questions = questions;
    } else {
      const findOrCreate = (qid: string): (typeof stats.questions)[number] => {
        let qStats = stats.questions.find((qs) => qs.question.toJSON() === qid);
        if (!qStats) {
          qStats = {
            _id: new mongoose.Types.ObjectId(),
            question: new mongoose.Types.ObjectId(qid),
            totalResponses: 0,
            mean: 0,
            m2: 0,
            choicesCount: new Map(),
            lastUpdated: new Date(),
          };
          stats.questions.push(qStats);
        }

        return qStats;
      };

      for (const [qid, entries] of qMap.entries()) {
        const qStats = findOrCreate(qid);
        for (const {points: x, choiceId} of entries) {
          const n_old = qStats.totalResponses ?? 0;
          const mean_old = qStats.mean ?? 0;
          const m2_old = qStats.m2 ?? 0;

          const n_new = n_old + 1;
          const delta = x - mean_old;
          const mean_new = mean_old + delta / n_new;
          const m2_new = m2_old + delta * (x - mean_new);

          qStats.totalResponses = n_new;
          qStats.mean = mean_new;
          qStats.m2 = m2_new;

          qStats.choicesCount.set(
            choiceId,
            (qStats.choicesCount.get(choiceId) ?? 0) + 1,
          );
          qStats.lastUpdated = new Date();
        }
      }
    }

    stats.totalCompletedSessions = (stats.totalCompletedSessions || 0) + 1;
    stats.lastUpdated = new Date();

    stats.markModified('questions');
    await stats.save();
  }
}
