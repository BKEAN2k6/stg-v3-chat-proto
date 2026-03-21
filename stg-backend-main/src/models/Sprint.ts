import mongoose from 'mongoose';
import {prop, pre, post, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {type StrengthSlug} from '../api/client/ApiTypes';
import {User} from './User';
import {Community} from './Community';

class SprintPlayerClass {
  @prop()
  public _id: mongoose.Types.ObjectId;

  @prop()
  public nickname: string;

  @prop()
  public color: string;

  @prop()
  public avatar: string;
}

class SharedStrength {
  @prop()
  public from: mongoose.Types.ObjectId;

  @prop()
  public to: mongoose.Types.ObjectId;

  @prop()
  public strength: StrengthSlug;
}

@pre<Sprint>('validate', function () {
  if (!this.isNew) {
    return;
  }

  this.code = Math.floor(100_000 + Math.random() * 900_000).toString();
})
@pre<Sprint>('save', async function () {
  if (!this.isNew) {
    return;
  }

  await mongoose
    .model('AclItem')
    .create({parent: this.community, resourceId: this._id});
})
@post<Sprint>(
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
export class Sprint extends TimeStamps {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, unique: true})
  public code: string;

  @prop({default: false})
  public isStarted: boolean;

  @prop({default: false})
  public isEnded: boolean;

  @prop()
  public roomCount: number;

  @prop({default: [], type: [SharedStrength]})
  public sharedStrengths: SharedStrength[];

  @prop({default: [], type: [SprintPlayerClass]})
  public players: SprintPlayerClass[];

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  public _id: mongoose.Types.ObjectId;

  public get expectedStrengthCount() {
    if (!this.isStarted) {
      return 0;
    }

    const playerCount = this.players.length;
    const fullRoomSize = Math.ceil(playerCount / this.roomCount);
    const fullRoomCount = Math.floor(playerCount / fullRoomSize);
    const peopleinFullRooms = fullRoomCount * fullRoomSize;
    const peopleInLastRoom = playerCount - peopleinFullRooms;

    return (
      fullRoomCount * (fullRoomSize * (fullRoomSize - 1)) +
      peopleInLastRoom * (peopleInLastRoom - 1)
    );
  }

  public get isCompleted() {
    if (!this.isStarted) {
      return false;
    }

    return this.sharedStrengths.length === this.expectedStrengthCount;
  }
}
