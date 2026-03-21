import {modelOptions, prop, PropType, Ref, index} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from './User.js';

@modelOptions({schemaOptions: {_id: false}})
export class MultipleChoiceOption {
  @prop({required: true, type: String})
  public id: string;

  @prop({required: true, type: String})
  public label: string;

  @prop({type: String})
  public emoji?: string;
}

@modelOptions({schemaOptions: {_id: false}})
export class InteractiveMetadata {
  @prop({required: true, type: String, enum: ['multiple_choice', 'thumbs']})
  public type: 'multiple_choice' | 'thumbs';

  @prop({type: () => [MultipleChoiceOption]}, PropType.ARRAY)
  public options?: MultipleChoiceOption[];

  @prop({type: String})
  public selectedOptionId?: string;

  @prop({type: String})
  public selectedValue?: 'up' | 'down';
}

@modelOptions({schemaOptions: {_id: false}})
export class CoachingSessionMessage {
  @prop({required: true, type: String})
  public role: 'user' | 'assistant' | 'system';

  @prop({required: true, type: String})
  public content: string;

  @prop({required: true, type: Date, default: () => new Date()})
  public createdAt: Date;

  @prop({type: () => InteractiveMetadata})
  public metadata?: InteractiveMetadata;
}

@modelOptions({schemaOptions: {_id: false}})
export class CoachingSessionSummary {
  @prop({required: true, type: String})
  public title: string;

  @prop({required: true, type: String})
  public content: string;

  @prop({required: true, type: Date})
  public completedAt: Date;
}

@modelOptions({
  schemaOptions: {
    toJSON: {virtuals: true},
  },
})
@index({user: 1, createdAt: -1})
export class CoachingSession extends TimeStamps {
  // Snapshot of plan data at session creation (not a reference)
  @prop({required: true, type: String})
  public planTitle: string;

  @prop({required: true, type: String})
  public planDescription: string;

  @prop({required: true, type: String})
  public planContent: string;

  // Snapshot of base prompt at session creation
  @prop({required: true, type: String})
  public basePromptContent: string;

  @prop({ref: () => User, required: true, index: true})
  public user: Ref<User>;

  @prop({required: true, type: String, default: 'active'})
  public status: 'active' | 'completed' | 'abandoned';

  @prop({type: () => [CoachingSessionMessage], default: []}, PropType.ARRAY)
  public messages: CoachingSessionMessage[];

  @prop({type: Date})
  public completedAt?: Date;

  @prop({type: () => CoachingSessionSummary})
  public summary?: CoachingSessionSummary;

  id: string;
}
