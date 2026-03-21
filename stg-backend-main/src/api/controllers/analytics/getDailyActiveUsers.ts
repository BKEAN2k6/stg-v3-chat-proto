import {type Request, type Response} from 'express';
import {Parser} from '@json2csv/plainjs';
import {DailyActiveUsers} from '../../../models';
import {
  type GetDailyActiveUsersResponse,
  type GetDailyActiveUsersQuery,
} from '../../client/ApiTypes';
import calculateRetention from './calculateRetention';

const parser = new Parser({
  fields: [
    'app',
    'community',
    'count',
    'retention',
    'communityUserCount',
    'date',
  ],
});

export async function getDailyActiveUsers(
  request: Request,
  response: Response,
): Promise<void> {
  const {format} = request.query as GetDailyActiveUsersQuery;
  const dailyActiveUsers = await DailyActiveUsers.find().populate({
    path: 'community',
    select: 'name',
  });

  const dailyActiveUsersJSON = calculateRetention(dailyActiveUsers, 'daily');

  if (format === 'csv') {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${new Date().toISOString()}_daily-active-users.csv"`,
    );

    response.send(parser.parse(dailyActiveUsersJSON));
    return;
  }

  response.json(dailyActiveUsersJSON satisfies GetDailyActiveUsersResponse);
}
