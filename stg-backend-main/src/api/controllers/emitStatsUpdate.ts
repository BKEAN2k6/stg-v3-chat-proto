import {type Request} from 'express';
import {CommunityStats} from '../../models/CommunityStats';
import {type UpdateCommunityStatsEvent} from '../client/ApiTypes';

export async function emitStatsUpdate(
  socketManager: Request['events'],
  communityStats: Request['stats'],
  communityId: string,
  date: Date,
) {
  if (CommunityStats.getWeek(date) !== CommunityStats.getWeek(new Date())) {
    return;
  }

  const stats = await communityStats.getCommunityStats(communityId, date);
  void socketManager.emit(
    `/communities/${communityId}/stats`,
    'update',
    stats satisfies UpdateCommunityStatsEvent,
  );
}
