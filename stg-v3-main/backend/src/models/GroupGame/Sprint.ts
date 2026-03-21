import mongoose from 'mongoose';
import {modelOptions, prop, PropType} from '@typegoose/typegoose';
import {GroupGame} from './GroupGame.js';

const MAX_PLAYERS_IN_ROOM = 10;

export class SharedStrength {
  @prop({type: mongoose.Types.ObjectId, required: true})
  public from: mongoose.Types.ObjectId;

  @prop({type: mongoose.Types.ObjectId, required: true})
  public to: mongoose.Types.ObjectId;

  @prop({type: String, required: true})
  public strength: StrengthSlug;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Sprint extends GroupGame {
  @prop({default: [], type: () => [SharedStrength]}, PropType.ARRAY)
  public sharedStrengths: SharedStrength[];

  public _id: mongoose.Types.ObjectId;

  public get roomCount() {
    if (!this.isStarted) return 0;
    return Math.ceil(this.players.length / MAX_PLAYERS_IN_ROOM);
  }

  public get expectedStrengthCount() {
    if (!this.isStarted) return 0;

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
    if (!this.isStarted) return false;
    return this.sharedStrengths.length === this.expectedStrengthCount;
  }
}
