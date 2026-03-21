import {prop, type Ref} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {type StrengthSlug} from '../../api/client/ApiTypes';
import {UserImage} from '../UserImage';
import {Post} from './Post';

class Traslations {
  @prop({required: true})
  fi: string;

  @prop({required: true})
  en: string;

  @prop({required: true})
  sv: string;
}

export class CoachPost extends Post {
  @prop({required: true})
  public translations: Traslations;

  @prop({type: Date, required: true})
  public showDate: Date;

  @prop({ref: () => UserImage, default: []})
  public images: Array<Ref<UserImage>>;

  @prop({type: String, required: true, default: []})
  public strengths: mongoose.Types.Array<StrengthSlug>;
}
