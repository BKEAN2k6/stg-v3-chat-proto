import mongoose from 'mongoose';
import {prop, Ref, ReturnModelType, index} from '@typegoose/typegoose';
import {Community} from './Community';

@index({app: 1, page: 1, path: 1, community: 1, date: 1}, {unique: true})
export class PageView {
  public static async createPageView(
    this: ReturnModelType<typeof PageView>,
    data: {
      app: string;
      page: string;
      path: string;
      community: string;
    },
  ) {
    const now = new Date();
    const date = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    );
    const {app, page, path, community} = data;

    return this.updateOne(
      {
        app,
        page,
        path,
        community: new mongoose.Types.ObjectId(community),
        date,
      },
      {
        $inc: {
          count: 1,
        },
      },
      {upsert: true},
    );
  }

  @prop({required: true})
  public app: string;

  @prop({required: true})
  public page: string;

  @prop({required: true})
  public path: string;

  @prop({ref: () => Community, required: true})
  public community: Ref<Community>;

  @prop({required: true})
  public date: Date;

  @prop({required: true})
  public count: number;
}
