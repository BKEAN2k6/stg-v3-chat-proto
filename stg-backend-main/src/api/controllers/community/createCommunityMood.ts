import {type Request, type Response} from 'express';
import {getDay} from 'date-fns';
import {User} from '../../../models';
import {
  type CreateCommunityMoodParameters,
  type CreateCommunityMoodRequest,
  type CreateCommunityMoodResponse,
} from '../../client/ApiTypes';
import {emitStatsUpdate} from '../emitStatsUpdate';

export async function createCommunityMood(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateCommunityMoodParameters;
  const {mood} = request.body as CreateCommunityMoodRequest;

  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  await request.stats.updateMoodMeter(id, new Date(), mood);
  await user.save();

  const moodMeter = await request.stats.getMooodMeter(id, getDay(new Date()));

  response.status(201).json(moodMeter satisfies CreateCommunityMoodResponse);

  try {
    await emitStatsUpdate(request.events, request.stats, id, new Date());
  } catch (error) {
    request.logger.log(error);
  }
}
