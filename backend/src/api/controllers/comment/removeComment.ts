import {type Request, type Response} from 'express';
import {Comment, Notification} from '../../../models/index.js';
import {type RemoveCommentParameters} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function removeComment(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveCommentParameters;

  const comment = await Comment.findById(id);
  if (!comment) {
    response.status(404).json({error: 'Comment not found'});
    return;
  }

  await comment.delete();
  await request.stats.updateLeaderboard(
    comment.createdBy._id.toJSON(),
    comment.community._id.toJSON(),
    comment.createdAt!,
    -1,
  );

  response.sendStatus(204);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      comment.community._id.toJSON(),
      comment.createdAt!,
    );
    await Notification.deleteMany({
      $or: [{targetComment: comment._id}, {comment: comment._id}],
    });
  } catch (error) {
    request.error = error;
  }
}
