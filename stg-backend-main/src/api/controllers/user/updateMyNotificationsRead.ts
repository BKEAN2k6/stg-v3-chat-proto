import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Notification} from '../../../models';

export async function updateMyNotificationsRead(
  request: Request,
  response: Response,
): Promise<void> {
  const {date} = request.body as {date: string};
  const userId = new mongoose.Types.ObjectId(request.user.id);

  await Notification.updateMany(
    {
      user: userId,
      createdAt: {$lte: new Date(date)},
      isRead: false,
    },
    {isRead: true},
  );

  response.sendStatus(204);
}
