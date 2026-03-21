import mongoose from 'mongoose';
import {prop, Ref, ReturnModelType, index} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {Community} from './Community';
import {User} from './User';

@index({app: 1, community: 1, date: 1}, {unique: true})
export class MonthlyActiveUsers extends TimeStamps {
  public static async addUser(
    this: ReturnModelType<typeof MonthlyActiveUsers>,
    data: {
      app: string;
      user: mongoose.Types.ObjectId;
      community: mongoose.Types.ObjectId;
    },
  ) {
    const now = new Date();
    const date = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
    );
    const {app, user, community} = data;
    const communityUserCount = await mongoose
      .model('CommunityMembership')
      .countDocuments({
        community,
      });

    return this.updateOne(
      {
        app,
        community,
        date,
      },
      {
        $addToSet: {users: user},
        $set: {communityUserCount},
      },
      {upsert: true},
    );
  }

  @prop({required: true})
  public app: string;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({ref: () => User, required: true})
  public users: Array<Ref<User>>;

  @prop({required: true})
  public communityUserCount: number;

  public get count(): number {
    return this.users.length;
  }

  @prop({required: true})
  public date!: Date;
}
