import {modelOptions, prop, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {BillingContact} from './BillingContact.js';

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class BillingGroup extends TimeStamps {
  @prop({required: true, type: String, trim: true})
  public name: string;

  @prop({ref: () => BillingContact, required: true})
  public billingContact: Ref<BillingContact>;

  @prop({type: String})
  public notes?: string;

  @prop({type: Date})
  public lastSubscriptionEnd?: Date;

  public id: string;
}
