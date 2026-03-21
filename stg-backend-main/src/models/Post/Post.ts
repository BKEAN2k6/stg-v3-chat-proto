import type mongoose from 'mongoose';
import {
  prop,
  plugin,
  modelOptions,
  index,
  type Ref,
  type DocumentType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import MongooseDelete from 'mongoose-delete';
import {Community} from '../Community';
import {type Moment} from './Moment';
import {type SprintResult} from './SprintResult';
import {type Challenge} from './Challenge';
import {type ProxyPost} from './ProxyPost';
import {type CoachPost} from './CoachPost';

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
  schemaOptions: {collection: 'posts', discriminatorKey: 'postType'},
})
@index({community: 1, createdAt: -1})
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

  @prop({ref: () => Community})
  public community: Ref<Community>;

  @prop({required: true})
  public postType: string;

  @prop()
  public isReference: boolean;

  public _id: mongoose.Types.ObjectId;
}
