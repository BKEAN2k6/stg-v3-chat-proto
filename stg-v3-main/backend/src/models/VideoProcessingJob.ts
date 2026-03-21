import {prop, modelOptions} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
class Segment {
  @prop({required: true, type: Number})
  public start: number;

  @prop({required: true, type: Number})
  public stop: number;

  @prop({default: false, type: Boolean})
  public autoplay: boolean;

  @prop({default: false, type: Boolean})
  public loop: boolean;

  @prop({default: false, type: Boolean})
  public showToolbar: boolean;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class VideoProcessingJob extends TimeStamps {
  @prop({required: true, type: String})
  public url: string;

  @prop({enum: ['lottie', 'video'], type: String})
  public type: 'lottie' | 'video';

  @prop({enum: ['file', 'drive'], type: String})
  public source: 'file' | 'drive';

  @prop({required: true, type: String, unique: true})
  public fileName: string;

  @prop({type: Segment, default: []})
  public videoSegments: Segment[];

  @prop({type: Segment, default: []})
  public lottieSegments: Segment[];

  @prop({type: Number})
  public frameRate: number;

  @prop({type: Number, required: true, default: 0})
  public coverFrameTimestamp: number;

  @prop({type: Boolean, required: true, default: false})
  public loop: boolean;

  @prop({enum: ['pending', 'processing', 'completed', 'failed'], type: String})
  public status: 'pending' | 'processing' | 'completed' | 'failed';

  @prop({type: [String], default: []})
  public files: string[];

  @prop({type: String})
  public errorMessage?: string;

  id: string;
}
