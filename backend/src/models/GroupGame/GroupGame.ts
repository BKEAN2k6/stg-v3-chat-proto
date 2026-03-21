import mongoose from 'mongoose';
import {
  prop,
  modelOptions,
  type Ref,
  type DocumentType,
  PropType,
  plugin,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {User} from '../User.js';
import {Group} from '../Group.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {MemoryGame} from './MemoryGame.js';
import {Quiz} from './Quiz.js';
import {Sprint} from './Sprint.js';

export class GroupGamePlayer {
  @prop({type: mongoose.Schema.Types.ObjectId})
  public _id: mongoose.Types.ObjectId;

  @prop({required: true, type: String})
  public nickname: string;

  @prop({required: true, type: String})
  public color: string;

  @prop({required: true, type: String})
  public avatar: string;
}

function checkGameClass<T extends GroupGame>(
  document: Record<string, any>,
  name: string,
): document is DocumentType<T> {
  return document?.gameType === name;
}

@plugin(AclTreePlugin<GroupGame>, {
  parent: 'group',
})
@modelOptions({
  schemaOptions: {
    collection: 'groupGames',
    discriminatorKey: 'gameType',
    toJSON: {virtuals: true},
  },
})
export class GroupGame extends TimeStamps {
  public static isMemoryGame(
    document: Record<string, any>,
  ): document is DocumentType<MemoryGame> {
    return checkGameClass<MemoryGame>(document, 'memory-game');
  }

  public static isQuiz(
    document: Record<string, any>,
  ): document is DocumentType<Quiz> {
    return checkGameClass<Quiz>(document, 'quiz');
  }

  public static isSprint(
    document: Record<string, any>,
  ): document is DocumentType<Sprint> {
    return checkGameClass<Sprint>(document, 'sprint');
  }

  @prop({required: true, type: String})
  public gameType: string;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({required: true, type: String})
  public code: string;

  @prop({required: true, type: Date})
  public codeActiveUntil: Date;

  @prop({default: false, type: Boolean})
  public isStarted: boolean;

  @prop({default: false, type: Boolean})
  public isEnded: boolean;

  @prop({default: [], type: () => [GroupGamePlayer]}, PropType.ARRAY)
  public players: GroupGamePlayer[];

  @prop({ref: () => Group, required: true})
  public group: Ref<Group>;

  id: string;
}
