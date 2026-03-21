import type mongoose from 'mongoose';
import {prop, plugin, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import passportLocalMongoose from 'passport-local-mongoose';
import {type Strategy} from 'passport-local';
import {Community} from './Community';

type newUser = {
  firstName: string;
  lastName: string;
  email: string;
  language: string;
  roles?: string[];
};

@plugin(passportLocalMongoose, {
  usernameField: 'email',
  populateFields: ['selectedCommunity'],
})
export abstract class PassPortLocalUser extends TimeStamps {
  static createStrategy: () => Strategy;
  static register: (user: newUser, password: string) => Promise<User>;

  static serializeUser: () => (error: any, id?: any) => void;
  static deserializeUser: () => (error: any, user?: any) => void;

  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  authenticate: (password: string) => Promise<{error: string}>;
  setPassword: (newPassword: string) => Promise<void>;
  save: () => Promise<void>;
}

export class User extends PassPortLocalUser {
  @prop({index: true})
  public firstName: string;

  @prop({index: true})
  public lastName: string;

  @prop({unique: true, index: true, required: true})
  public email: string;

  @prop({default: ''})
  public avatar: string;

  @prop({default: false})
  public isEmailVerified?: boolean;

  @prop({required: true, default: 'en'})
  public language: 'en' | 'fi' | 'sv';

  @prop()
  public directusPassword?: string;

  @prop({default: [], type: [String]})
  public roles: Array<'super-admin'>;

  @prop({ref: () => Community})
  public selectedCommunity?: Ref<Community>;

  public _id: mongoose.Types.ObjectId;

  public id: string;

  public allowPasswordChange?: boolean;
}
