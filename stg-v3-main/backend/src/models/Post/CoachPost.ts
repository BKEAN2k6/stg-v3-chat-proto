import {prop, type Ref, PropType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {type StrengthSlug} from '../../api/client/ApiTypes.js';
import {UserImage} from '../UserImage.js';
import {Post} from './Post.js';

class Traslations {
  @prop({required: true, type: String})
  fi: string;

  @prop({required: true, type: String})
  en: string;

  @prop({required: true, type: String})
  sv: string;
}

export class CoachPost extends Post {
  @prop({required: true, type: Traslations})
  public translations: Traslations;

  @prop({type: Date, required: true})
  public showDate: Date;

  @prop({ref: () => UserImage, default: []}, PropType.ARRAY)
  public images: Array<Ref<UserImage>>;

  @prop({type: String, required: true, default: []}, PropType.ARRAY)
  public strengths: mongoose.Types.Array<StrengthSlug>;

  @prop({type: Boolean, default: false})
  public isProcessing: boolean;
}
