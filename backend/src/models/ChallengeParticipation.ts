import mongoose from 'mongoose';
import {prop, type Ref, modelOptions} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from './User.js';

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class ChallengeParticipation extends TimeStamps {
  @prop({required: true, index: true, type: mongoose.Types.ObjectId})
  public challenge: mongoose.Types.ObjectId;

  @prop({ref: () => User, required: true})
  public user: Ref<User>;

  id: string;
}
