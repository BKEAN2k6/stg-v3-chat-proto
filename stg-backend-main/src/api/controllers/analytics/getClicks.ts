import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Parser} from '@json2csv/plainjs';
import {Click} from '../../../models';
import {
  type GetClicksResponse,
  type GetClicksQuery,
} from '../../client/ApiTypes';

const parser = new Parser({
  fields: ['app', 'page', 'path', 'community', 'element', 'count', 'date'],
});

export async function getClicks(
  request: Request,
  response: Response,
): Promise<void> {
  const {format} = request.query as GetClicksQuery;
  const clicks = await Click.find().populate({
    path: 'community',
    select: 'name',
  });
  const clicksJSON = clicks.map(
    ({app, page, path, community, element, count, date}) => {
      let communityName = 'Unknown';

      if (isDocument(community)) {
        communityName = community.name;
      }

      return {
        app,
        page,
        path,
        community: communityName,
        element,
        count,
        date: date.toISOString(),
      };
    },
  );

  if (format === 'csv') {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${new Date().toISOString()}_pageviews.csv"`,
    );

    response.send(parser.parse(clicksJSON));
    return;
  }

  response.json(clicksJSON satisfies GetClicksResponse);
}
