import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Notification} from '../../../models';

export async function getMyNotifications(
  request: Request,
  response: Response,
): Promise<void> {
  const notifications = await Notification.find({
    user: new mongoose.Types.ObjectId(request.user.id),
    isRead: false,
  })
    .sort({createdAt: -1})
    .select(
      '_id actor isRead createdAt notificationType reaction comment targetComment targetPost',
    )
    .populate([
      {
        path: 'actor',
        select: '_id firstName lastName avatar',
      },
      {
        path: 'reaction',
        select: 'type',
      },
      {
        path: 'comment',
        select: 'content',
      },
      {
        path: 'targetComment',
        select: 'content',
      },
      {
        path: 'targetPost',
        select: 'content postType',
      },
    ]);

  response.json(notifications);
}
