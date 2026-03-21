import {type Request, type Response} from 'express';
import {Comment, Notification} from '../../../models';
import {type RemoveCommentParameters} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

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
    comment.createdBy._id.toHexString(),
    comment.community._id.toHexString(),
    comment.createdAt!,
    -1,
  );

  response.sendStatus(204);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      comment.community._id.toHexString(),
      comment.createdAt!,
    );
    await Notification.deleteMany({
      $or: [{targetComment: comment._id}, {comment: comment._id}],
    });
  } catch (error) {
    request.logger.log(error);
  }
}
