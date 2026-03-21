import {modelOptions, prop} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class BillingContact extends TimeStamps {
  @prop({required: true, type: String, trim: true})
  public name: string;

  @prop({required: true, type: String, lowercase: true, trim: true})
  public email: string;

  @prop({type: String, trim: true})
  public crmLink?: string;

  @prop({type: String})
  public notes?: string;

  public id: string;
}
