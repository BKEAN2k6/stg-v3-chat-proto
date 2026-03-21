import mongoose from 'mongoose';
import {modelOptions, prop, PropType} from '@typegoose/typegoose';
import {GroupGame} from './GroupGame.js';

export class MemoryGameCard {
  @prop({type: mongoose.Types.ObjectId})
  public _id: mongoose.Types.ObjectId;

  @prop({required: true, type: String})
  public strength: StrengthSlug;
}

export class FoundPair {
  @prop({required: true, type: mongoose.Types.ObjectId})
  public player: mongoose.Types.ObjectId;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public card1: mongoose.Types.ObjectId;

  @prop({required: true, type: mongoose.Types.ObjectId})
  public card2: mongoose.Types.ObjectId;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class MemoryGame extends GroupGame {
  @prop({type: mongoose.Types.ObjectId})
  public currentPlayer?: mongoose.Types.ObjectId;

  @prop(
    {default: [], required: true, type: () => [MemoryGameCard]},
    PropType.ARRAY,
  )
  public cards: MemoryGameCard[];

  @prop(
    {default: [], required: true, type: () => [mongoose.Types.ObjectId]},
    PropType.ARRAY,
  )
  public currentlyRevealedCards: mongoose.Types.ObjectId[];

  @prop({default: [], required: true, type: () => [FoundPair]}, PropType.ARRAY)
  public foundPairs: FoundPair[];
}
