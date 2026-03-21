import {type Request, type Response} from 'express';
import {Reaction} from '../../../models';
import {
  type UpdateReactionParameters,
  type UpdateReactionRequest,
  type UpdateReactionResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function updateReaction(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateReactionParameters;
  const {type} = request.body as UpdateReactionRequest;

  const reaction = await Reaction.findById(id);
  if (!reaction) {
    response.status(404).json({error: 'Reaction not found'});
    return;
  }

  const oldType = reaction.type;

  if (type) {
    reaction.type = type;
  }

  const communityId = reaction.community._id.toHexString();
  await reaction.save();
  await request.stats.updateCommunityStrenghts(
    communityId,
    reaction.createdAt!,
    reaction.type === 'like' ? [] : [reaction.type],
    oldType === 'like' ? [] : [oldType],
  );
  await reaction.populate([
    {
      path: 'createdBy',
      select: '_id firstName lastName avatar',
    },
  ]);

  response.status(200).json(reaction.toJSON() satisfies UpdateReactionResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      reaction.createdAt!,
    );
  } catch (error) {
    request.logger.log(error);
  }
}
