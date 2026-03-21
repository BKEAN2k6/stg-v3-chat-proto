import {type StrengthSlug} from '@/lib/strength-data';

export type SessionStrength = {
  id: string;
  date_created: string;
  user_created: string;
  strength_session: string;
  strength: StrengthSlug;
  is_for_group: boolean | undefined;
  is_for_self: boolean | undefined;
  is_bonus: boolean | undefined;
  user: string;
};
