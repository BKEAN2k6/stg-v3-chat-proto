import {prop} from '@typegoose/typegoose';
import {
  type StrengthSlug,
  type ChallengeTheme,
} from '../../api/client/ApiTypes.js';
import {Post} from './Post.js';

class Traslations {
  @prop({required: true, type: String})
  fi: string;

  @prop({required: true, type: String})
  en: string;

  @prop({required: true, type: String})
  sv: string;
}

export class Challenge extends Post {
  @prop({required: true, type: Traslations})
  public translations: Traslations;

  @prop({type: String, required: true})
  public theme: ChallengeTheme;

  @prop({type: String, required: true})
  public strength: StrengthSlug;

  @prop({type: Date, required: true})
  public showDate: Date;

  @prop({type: Boolean, default: false})
  public isProcessing: boolean;
}
