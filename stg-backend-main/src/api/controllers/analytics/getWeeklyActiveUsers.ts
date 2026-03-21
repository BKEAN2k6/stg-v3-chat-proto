import {type Request, type Response} from 'express';
import {Parser} from '@json2csv/plainjs';
import {WeeklyActiveUsers} from '../../../models';
import {
  type GetWeeklyActiveUsersResponse,
  type GetWeeklyActiveUsersQuery,
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

export async function getWeeklyActiveUsers(
  request: Request,
  response: Response,
): Promise<void> {
  const {format} = request.query as GetWeeklyActiveUsersQuery;
  const weeklyActiveUsers = await WeeklyActiveUsers.find().populate({
    path: 'community',
    select: 'name',
  });
  const weeklyActiveUsersJSON = calculateRetention(weeklyActiveUsers, 'weekly');

  if (format === 'csv') {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${new Date().toISOString()}_weekly-active-users.csv"`,
    );

    response.send(parser.parse(weeklyActiveUsersJSON));
    return;
  }

  response.json(weeklyActiveUsersJSON satisfies GetWeeklyActiveUsersResponse);
}
