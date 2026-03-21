import {prop} from '@typegoose/typegoose';
import {
  type StrengthSlug,
  type ChallengeTheme,
} from '../../api/client/ApiTypes';
import {Post} from './Post';

class Traslations {
  @prop({required: true})
  fi: string;

  @prop({required: true})
  en: string;

  @prop({required: true})
  sv: string;
}

export class Challenge extends Post {
  @prop({required: true})
  public translations: Traslations;

  @prop({type: String, required: true})
  public theme: ChallengeTheme;

  @prop({type: String, required: true})
  public strength: StrengthSlug;

  @prop({type: Date, required: true})
  public showDate: Date;
}
