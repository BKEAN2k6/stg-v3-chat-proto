import mongoose from 'mongoose';
import {prop, Ref, ReturnModelType, index} from '@typegoose/typegoose';
import {Community} from './Community';

@index(
  {app: 1, page: 1, path: 1, community: 1, element: 1, date: 1},
  {unique: true},
)
export class Click {
  public static async createClick(
    this: ReturnModelType<typeof Click>,
    data: {
      app: string;
      page: string;
      path: string;
      community: string;
      element: string;
    },
  ) {
    const now = new Date();
    const date = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    );
    const {app, page, path, community, element} = data;

    return this.updateOne(
      {
        app,
        page,
        path,
        community: new mongoose.Types.ObjectId(community),
        element,
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
  public element: string;

  @prop({required: true})
  public count: number;

  @prop({required: true})
  public date: Date;
}
