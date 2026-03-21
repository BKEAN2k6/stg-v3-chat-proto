import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {isDocument} from '@typegoose/typegoose';
import {Post, ChallengeParticipation} from '../../../models/index.js';
import {
  type CreateChallengeParticipationParameters,
  type CreateChallengeParticipationResponse,
} from '../../client/ApiTypes.js';
import {emitStatsUpdate} from '../emitStatsUpdate.js';

export async function createChallengeParticipation(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateChallengeParticipationParameters;
  const user = new mongoose.Types.ObjectId(request.user.id);

  const challenge = await Post.findById(id);
  if (!challenge) {
    response.status(404).json({error: 'Challenge not found'});
    return;
  }

  const existingChallengeParticipation = await ChallengeParticipation.exists({
    challenge: challenge._id,
    user,
  });

  if (existingChallengeParticipation) {
    response.status(400).json({
      error: 'Challenge participation to the same challenge exists already',
    });
    return;
  }

  const challengeParticipation = await ChallengeParticipation.create({
    challenge: challenge._id,
    user,
  });

  const communityId = challenge.community._id.toJSON();

  await request.stats.updateLeaderboard(
    challengeParticipation.user._id.toJSON(),
    communityId,
    challengeParticipation.createdAt!,
    1,
  );
  await challengeParticipation.populate([
    {
      path: 'user',
      select: '_id firstName lastName avatar',
    },
  ]);

  if (!isDocument(challengeParticipation.user)) {
    throw new Error('Challenge participation user is not populated');
  }

  response
    .status(201)
    .json(
      challengeParticipation.user.toJSON() satisfies CreateChallengeParticipationResponse,
    );

  try {
    await emitStatsUpdate(
      request.events,
      request.stats,
      communityId,
      challengeParticipation.createdAt!,
    );
  } catch (error) {
    request.error = error;
  }
}
