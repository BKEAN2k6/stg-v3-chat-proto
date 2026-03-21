import {prop} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {type StrengthSlug, type ChallengeTheme} from '../api/client/ApiTypes';

class Traslations {
  @prop({required: true})
  fi: string;

  @prop({required: true})
  en: string;

  @prop({required: true})
  sv: string;
}

export class ChallengeData extends TimeStamps {
  @prop({required: true})
  public translations: Traslations;

  @prop({type: String, required: true})
  public theme: ChallengeTheme;

  @prop({type: Date, required: true})
  public showDate: Date;

  @prop({type: String, required: true})
  public strength: StrengthSlug;
}
