import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {StrengthGoal, Group, User} from '../../../models/index.js';
import {
  type CreateStrengthGoalRequest,
  type CreateStrengthGoalResponse,
  type CreateStrengthGoalParameters,
} from '../../client/ApiTypes.js';

export async function createStrengthGoal(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateStrengthGoalParameters;
  const {
    strength,
    description,
    target,
    targetDate,
    events = [],
    isSystemCreated,
  } = request.body as CreateStrengthGoalRequest;
  const group = await Group.findById(id).select('_id name community');

  if (!group) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const strengthGoal = await StrengthGoal.create({
    strength,
    description,
    target,
    targetDate,
    group,
    isSystemCreated,
    events: events.map((event) => ({
      createdAt: new Date(event.createdAt),
      createdBy: new mongoose.Types.ObjectId(request.user.id),
    })),
    createdBy: new mongoose.Types.ObjectId(request.user.id),
  });

  await User.updateOne(
    {_id: new mongoose.Types.ObjectId(request.user.id)},
    {
      $set: {
        [`lastActiveGroups.${group.community._id.toJSON()}`]:
          group._id.toJSON(),
      },
    },
  );

  if (events) {
    await request.stats.updateCommunityStrenghts(
      group.community._id.toJSON(),
      new Date(),
      events.map(() => strength),
    );

    await request.stats.updateLeaderboard(
      request.user.id,
      group.community._id.toJSON(),
      strengthGoal.createdAt!,
      events.length,
    );
  }

  response.json({
    ...strengthGoal.toJSON(),
    targetDate: strengthGoal.targetDate.toISOString(),
    events: strengthGoal.events.map((event) => ({
      createdAt: event.createdAt.toJSON(),
    })),
    createdAt: strengthGoal.createdAt!.toJSON(),
    updatedAt: strengthGoal.updatedAt!.toJSON(),
    group: group.toJSON(),
  } satisfies CreateStrengthGoalResponse);
}
