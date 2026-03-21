import mongoose from 'mongoose';
import {modelOptions, index, prop, type Ref} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {GroupGame} from './GroupGame/GroupGame.js';

@index({createdAt: 1}, {expireAfterSeconds: 60 * 60 * 24}) // 24h TTL
@modelOptions({schemaOptions: {collection: 'joincodes'}})
export class JoinCode extends TimeStamps {
  @prop({required: true, unique: true, type: String})
  public code: string;

  @prop({required: true, type: Date})
  public codeActiveUntil: Date;

  @prop({ref: () => GroupGame, required: true})
  public game: Ref<GroupGame>;

  id: string;

  public async generate(tries = 10): Promise<void> {
    if (tries <= 0) throw new Error('Failed to generate unique code');
    const code = Math.floor(100_000 + Math.random() * 900_000).toString();
    const JoinCodeModel = mongoose.model<JoinCode>('JoinCode');
    const exists = await JoinCodeModel.findOne({code}).lean().exec();
    if (exists) return this.generate(tries - 1);
    this.code = code;
    this.codeActiveUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
}
