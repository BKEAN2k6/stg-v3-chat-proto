import {type Request, type Response} from 'express';
import {Parser} from '@json2csv/plainjs';
import {MonthlyActiveUsers} from '../../../models';
import {
  type GetMonthlyActiveUsersResponse,
  type GetMonthlyActiveUsersQuery,
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

export async function getMonthlyActiveUsers(
  request: Request,
  response: Response,
): Promise<void> {
  const {format} = request.query as GetMonthlyActiveUsersQuery;
  const monthlyActiveUsers = await MonthlyActiveUsers.find().populate({
    path: 'community',
    select: 'name',
  });
  const monthlyActiveUsersJSON = calculateRetention(
    monthlyActiveUsers,
    'monthly',
  );

  if (format === 'csv') {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${new Date().toISOString()}_monthly-active-users.csv"`,
    );

    response.send(parser.parse(monthlyActiveUsersJSON));
    return;
  }

  response.json(monthlyActiveUsersJSON satisfies GetMonthlyActiveUsersResponse);
}
