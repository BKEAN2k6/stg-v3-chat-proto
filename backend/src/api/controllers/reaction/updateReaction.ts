import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Reaction} from '../../../models/index.js';
import {
  type UpdateReactionParameters,
  type UpdateReactionRequest,
  type UpdateReactionResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

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

  const communityId = reaction.community._id.toJSON();
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

  if (!isDocument(reaction.createdBy)) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  response.status(200).json({
    ...reaction.toJSON(),
    createdBy: reaction.createdBy.toJSON(),
    createdAt: reaction.createdAt!.toJSON(),
  } satisfies UpdateReactionResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      reaction.createdAt!,
    );
  } catch (error) {
    request.error = error;
  }
}
