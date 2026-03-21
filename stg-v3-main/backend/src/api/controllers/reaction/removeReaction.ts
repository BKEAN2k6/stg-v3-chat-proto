import {type Request, type Response} from 'express';
import {Reaction, Notification} from '../../../models/index.js';
import {type RemoveCommentParameters} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function removeReaction(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveCommentParameters;

  const reaction = await Reaction.findById(id);
  if (!reaction) {
    response.status(404).json({error: 'Reaction not found'});
    return;
  }

  await reaction.delete();

  const communityId = reaction.community._id.toJSON();

  await request.stats.updateLeaderboard(
    reaction.createdBy._id.toJSON(),
    communityId,
    reaction.createdAt!,
    -1,
  );

  if (reaction.type !== 'like') {
    await request.stats.updateCommunityStrenghts(
      communityId,
      reaction.createdAt!,
      [],
      [reaction.type],
    );
  }

  response.sendStatus(204);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      reaction.createdAt!,
    );
    await Notification.deleteMany({reaction: reaction._id});
  } catch (error) {
    request.error = error;
  }
}
