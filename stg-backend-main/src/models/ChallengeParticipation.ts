import mongoose from 'mongoose';
import {prop, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {User} from './User';

export class ChallengeParticipation extends TimeStamps {
  @prop({required: true, index: true})
  public challenge: mongoose.Types.ObjectId;

  @prop({ref: () => User, required: true})
  public user: Ref<User>;
}
