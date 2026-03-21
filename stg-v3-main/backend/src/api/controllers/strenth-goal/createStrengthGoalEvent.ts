import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {StrengthGoal, GoalCompleted} from '../../../models/index.js';
import {
  type CreateStrengthGoalEventParameters,
  type CreateStrengthGoalEventResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function createStrengthGoalEvent(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateStrengthGoalEventParameters;
  const strengthGoal = await StrengthGoal.findById(id).populate({
    path: 'group',
    select: '_id community name',
  });
  if (!strengthGoal) {
    response.status(404).json({error: 'Strength goal not found'});
    return;
  }

  if (!isDocument(strengthGoal.group)) {
    throw new Error('Group is not a document');
  }

  const event = {
    createdAt: new Date(),
    createdBy: new mongoose.Types.ObjectId(request.user.id),
  };

  if (strengthGoal.events.length < strengthGoal.target) {
    strengthGoal.events.push(event);
  }

  await strengthGoal.save();

  const communityId = strengthGoal.group.community._id.toJSON();

  if (strengthGoal.events.length === strengthGoal.target) {
    const completedCount = await StrengthGoal.countDocuments({
      group: strengthGoal.group._id,
      strength: strengthGoal.strength,
      $expr: {
        $gte: [{$size: {$ifNull: ['$events', []]}}, '$target'],
      },
    });

    await GoalCompleted.findOneAndUpdate(
      {
        community: communityId,
        group: strengthGoal.group._id,
        strength: strengthGoal.strength,
        completedCount,
      },
      {
        $setOnInsert: {
          user: event.createdBy,
          createdBy: strengthGoal.createdBy,
          createdAt: new Date(),
        },
      },
      {upsert: true},
    );
  }

  await request.stats.updateCommunityStrenghts(communityId, new Date(), [
    strengthGoal.strength,
  ]);

  await request.stats.updateLeaderboard(
    request.user.id,
    communityId,
    event.createdAt,
    1,
  );

  response.json({
    createdAt: event.createdAt.toJSON(),
  } satisfies CreateStrengthGoalEventResponse);

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      event.createdAt,
    );
  } catch (error) {
    request.error = error;
  }
}
