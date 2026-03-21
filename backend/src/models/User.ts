import {
  modelOptions,
  prop,
  plugin,
  index,
  type Ref,
  DocumentType,
  PropType,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {AutoIncrementID} from '@typegoose/auto-increment';
import passportLocalMongoose, {
  type PassportLocalMongooseOptions,
} from 'passport-local-mongoose';
import {type Strategy} from 'passport-local';
import {type Schema} from 'mongoose';
import {LanguageCode} from '../api/client/ApiTypes.js';
import {Community} from './Community.js';

// Wrapper to satisfy typegoose plugin typing and handle ESM interop
type PassportPluginFn = (
  schema: Schema,
  options?: PassportLocalMongooseOptions,
) => void;

const passportPlugin: PassportPluginFn = (schema, options) => {
  // Handle both ts-node (unwrapped) and compiled ESM (needs .default)
  const plm = passportLocalMongoose as unknown as
    | PassportPluginFn
    | {default: PassportPluginFn};
  const plugin = typeof plm === 'function' ? plm : plm.default;
  plugin(schema, options);
};

type newUser = {
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  country: string;
  organization: string;
  organizationType: string;
  organizationRole: string;
  registrationType: 'individual' | 'onboarding' | 'super-admin-created';
  roles?: string[];
  avatar?: string;
  selectedCommunity?: string;
};

@modelOptions({schemaOptions: {_id: false}})
class Consents {
  @prop({required: true, type: Boolean})
  public vimeo: boolean;
}

@plugin(AutoIncrementID, {field: 'sequenceNumber', startAt: 4281})
@plugin(passportPlugin, {
  usernameField: 'email',
  populateFields: ['selectedCommunity'],
})
export abstract class PassPortLocalUser extends TimeStamps {
  static createStrategy: () => Strategy;
  static register: (
    user: newUser,
    password: string,
  ) => Promise<DocumentType<User>>;

  static serializeUser: () => (error: any, id?: any) => void;
  static deserializeUser: () => (error: any, user?: any) => void;

  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  authenticate: (password: string) => Promise<{error: string}>;
  setPassword: (newPassword: string) => Promise<void>;
  save: () => Promise<void>;
}
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
@index({sequenceNumber: 1})
@index({firstName: 1, lastName: 1, email: 1})
@index({createdAt: -1})
export class User extends PassPortLocalUser {
  @prop({index: true, type: String})
  public firstName: string;

  @prop({index: true, type: String})
  public lastName: string;

  @prop({unique: true, index: true, required: true, type: String})
  public email: string;

  @prop({type: Number})
  public sequenceNumber: number;

  @prop({default: '', type: String})
  public avatar: string;

  @prop({required: true, type: String})
  public country: string;

  @prop({required: true, type: String})
  public organization: string;

  @prop({required: true, type: String})
  public organizationType: string;

  @prop({required: true, type: String})
  public organizationRole: string;

  @prop({default: 'individual', type: String})
  public registrationType: 'individual' | 'onboarding' | 'super-admin-created';

  @prop({default: false, type: Boolean})
  public isEmailVerified: boolean;

  @prop({required: true, default: 'en', type: String})
  public language: LanguageCode;

  @prop({default: [], type: [String]}, PropType.ARRAY)
  public roles: Array<'super-admin'>;

  @prop({ref: () => Community})
  public selectedCommunity?: Ref<Community>;

  @prop({type: String}, PropType.MAP)
  public lastActiveGroups?: Map<string, string>;

  @prop({default: false, type: Boolean})
  public hasSetPasseord: boolean;

  @prop({required: true, default: {vimeo: false}, type: () => Consents})
  public consents: Consents;

  @prop({default: false, type: Boolean})
  public hasSetConsents: boolean;

  @prop({type: Date})
  public introSlidesRead: Date;

  public id: string;

  public allowPasswordChange?: boolean;
}
