import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Parser} from '@json2csv/plainjs';
import {PageView} from '../../../models';
import {
  type GetPageViewsResponse,
  type GetPageViewsQuery,
} from '../../client/ApiTypes';

const parser = new Parser({
  fields: ['app', 'page', 'path', 'community', 'count', 'date'],
});

export async function getPageViews(
  request: Request,
  response: Response,
): Promise<void> {
  const {format} = request.query as GetPageViewsQuery;
  const pageViews = await PageView.find().populate({
    path: 'community',
    select: 'name',
  });
  const pageViewsJSON = pageViews.map(
    ({app, page, path, community, count, date}) => {
      let communityName = 'Unknown';

      if (isDocument(community)) {
        communityName = community.name;
      }

      return {
        app,
        page,
        path,
        community: communityName,
        count,
        date: date.toISOString(),
      };
    },
  );

  if (format === 'csv') {
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${new Date().toISOString()}_page-views.csv"`,
    );

    response.send(parser.parse(pageViewsJSON));
    return;
  }

  response.json(pageViewsJSON satisfies GetPageViewsResponse);
}
