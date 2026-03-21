import mongoose from 'mongoose';
import {prop, pre, post, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {type StrengthSlug} from '../api/client/ApiTypes';
import {User} from './User';
import {Community} from './Community';

class MemoryGamePlayerClass {
  @prop()
  public _id: mongoose.Types.ObjectId;

  @prop({required: true})
  public nickname: string;

  @prop({required: true})
  public color: string;
}

class MemoryGameCard {
  @prop()
  public _id: mongoose.Types.ObjectId;

  @prop({required: true})
  public strength: StrengthSlug;
}

class FoundPair {
  @prop({required: true})
  public player: mongoose.Types.ObjectId;

  @prop({required: true})
  public card1: mongoose.Types.ObjectId;

  @prop({required: true})
  public card2: mongoose.Types.ObjectId;
}

@pre<MemoryGame>('validate', function () {
  if (!this.isNew) {
    return;
  }

  this.code = Math.floor(100_000 + Math.random() * 900_000).toString();
})
@pre<MemoryGame>('save', async function () {
  if (!this.isNew) {
    return;
  }

  await mongoose
    .model('AclItem')
    .create({parent: this.community, resourceId: this._id});
})
@post<MemoryGame>(
  'deleteOne',
  async function () {
    const resourceId: mongoose.Types.ObjectId = this.getFilter()
      ._id as mongoose.Types.ObjectId;
    if (!resourceId) {
      throw new Error('Query _id is not found.');
    }

    await mongoose.model('AclItem').deleteOne({resourceId});
  },
  {document: false, query: true},
)
export class MemoryGame extends TimeStamps {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, unique: true})
  public code: string;

  @prop({default: false})
  public isStarted: boolean;

  @prop({default: false})
  public isEnded: boolean;

  @prop({default: [], type: [MemoryGamePlayerClass]})
  public players: MemoryGamePlayerClass[];

  @prop()
  public currentPlayer?: mongoose.Types.ObjectId;

  @prop({default: [], required: true, type: [MemoryGameCard]})
  public cards: MemoryGameCard[];

  @prop({default: [], required: true, type: [mongoose.Types.ObjectId]})
  public currentlyRevealedCards: mongoose.Types.ObjectId[];

  @prop({default: [], required: true, type: [FoundPair]})
  public foundPairs: FoundPair[];

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  public _id: mongoose.Types.ObjectId;
}
