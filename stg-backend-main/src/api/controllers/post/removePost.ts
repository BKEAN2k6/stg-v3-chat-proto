import {type Request, type Response} from 'express';
import {Post, Notification} from '../../../models';
import {type RemovePostParameters} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function removePost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemovePostParameters;

  const post = await Post.findById(id);
  if (!post) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  const communityId = post.community._id.toHexString();

  if (Post.isMoment(post)) {
    await request.stats.updateCommunityStrenghts(
      communityId,
      post.createdAt!,
      [],
      post.strengths,
    );

    await request.stats.updateLeaderboard(
      post.createdBy._id.toHexString(),
      communityId,
      post.createdAt!,
      -1,
    );
  }

  await post.delete();

  response.sendStatus(204);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      post.createdAt!,
    );
    await Notification.deleteMany({targetPost: post._id});
  } catch (error) {
    request.logger.log(error);
  }
}
