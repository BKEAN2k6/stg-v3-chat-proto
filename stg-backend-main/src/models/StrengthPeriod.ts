import mongoose from 'mongoose';
import {prop} from '@typegoose/typegoose';
import {type StrengthSlug} from '../api/client/ApiTypes';

export class TimelineItem {
  @prop({required: true})
  public articleId: mongoose.Types.ObjectId;

  @prop({required: true})
  public start: Date;

  public _id: mongoose.Types.ObjectId;
}

export class StrenghtPeriod {
  @prop({
    type: TimelineItem,
    required: true,
    default: [],
    validate: {
      validator(timeline: TimelineItem[]) {
        return timeline.length === 4;
      },
      message: 'Timeline must have 4 items',
    },
  })
  public timeline: mongoose.Types.Array<TimelineItem>;

  @prop({type: String, required: true})
  public strength: StrengthSlug;
}
