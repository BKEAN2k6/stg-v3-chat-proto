import {modelOptions, prop, pre, type Ref} from '@typegoose/typegoose';
import {Community} from './Community.js';
import {User} from './User.js';

const CODE_LENGTH = 6;
const CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateInvitationCode(): string {
  let code = '';

  for (let index = 0; index < CODE_LENGTH; index += 1) {
    const characterIndex = Math.floor(Math.random() * CODE_CHARACTERS.length);
    code += CODE_CHARACTERS[characterIndex];
  }

  return code;
}

@pre<CommunityInvitation>('validate', function () {
  if (!this.isNew) {
    return;
  }

  this.code = generateInvitationCode();
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class CommunityInvitation {
  @prop({index: true, unique: true, type: String})
  public code: string;

  @prop({ref: () => Community, index: true})
  public community: Ref<Community>;

  @prop({ref: () => User})
  public createdBy: Ref<User>;

  @prop({expires: 60 * 60 * 21 * 24, default: Date.now, type: Date})
  public createdAt: Date;

  id: string;
}
