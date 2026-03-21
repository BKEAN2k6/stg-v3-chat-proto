import {
  prop,
  plugin,
  modelOptions,
  index,
  type Ref,
  type DocumentType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import MongooseDelete from 'mongoose-delete';
import {Community} from '../Community.js';
import {type Moment} from './Moment.js';
import {type SprintResult} from './SprintResult.js';
import {type Challenge} from './Challenge.js';
import {type ProxyPost} from './ProxyPost.js';
import {type CoachPost} from './CoachPost.js';
import {type LessonCompleted} from './LessonCompleted.js';
import {GoalCompleted} from './GoalCompleted.js';
import {OnboardingCompleted} from './OnboardingCompleted.js';
import {type StrengthCompleted} from './StrengthCompleted.js';

abstract class SofDelete extends TimeStamps {
  public delete: () => Promise<void>;
}

function checkPostClass<T extends Post>(
  document: Record<string, any>,
  name: string,
): document is DocumentType<T> {
  return document?.postType === name;
}

@plugin(MongooseDelete, {overrideMethods: true})
@modelOptions({
  schemaOptions: {
    collection: 'posts',
    discriminatorKey: 'postType',
    toJSON: {
      virtuals: true,
    },
  },
})
@index({community: 1, createdAt: -1, deleted: 1})
export class Post extends SofDelete {
  public static isMoment(
    document: Record<string, any>,
  ): document is DocumentType<Moment> {
    return checkPostClass<Moment>(document, 'moment');
  }

  public static isSprintResult(
    document: Record<string, any>,
  ): document is DocumentType<SprintResult> {
    return checkPostClass<SprintResult>(document, 'sprint-result');
  }

  public static isChallenge(
    document: Record<string, any>,
  ): document is DocumentType<Challenge> {
    return checkPostClass<Challenge>(document, 'challenge');
  }

  public static isCoachPost(
    document: Record<string, any>,
  ): document is DocumentType<CoachPost> {
    return checkPostClass<CoachPost>(document, 'coach-post');
  }

  public static isProxyPost(
    document: Record<string, any>,
  ): document is DocumentType<ProxyPost> {
    return checkPostClass<ProxyPost>(document, 'proxy-post');
  }

  public static isLessonCompleted(
    document: Record<string, any>,
  ): document is DocumentType<LessonCompleted> {
    return checkPostClass<LessonCompleted>(document, 'lesson-completed');
  }

  public static isOnboardingCompleted(
    document: Record<string, any>,
  ): document is DocumentType<OnboardingCompleted> {
    return checkPostClass<OnboardingCompleted>(
      document,
      'onboarding-completed',
    );
  }

  public static isGoalCompleted(
    document: Record<string, any>,
  ): document is DocumentType<GoalCompleted> {
    return checkPostClass<GoalCompleted>(document, 'goal-completed');
  }

  public static isStrengthCompleted(
    document: Record<string, any>,
  ): document is DocumentType<StrengthCompleted> {
    return checkPostClass<StrengthCompleted>(document, 'strength-completed');
  }

  @prop({ref: () => Community})
  public community: Ref<Community>;

  @prop({required: true, type: String})
  public postType: string;

  @prop({type: Boolean})
  public isReference: boolean;

  id: string;
}
