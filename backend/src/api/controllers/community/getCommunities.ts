import {type Request, type Response} from 'express';
import {Community} from '../../../models/index.js';
import {
  type GetCommunitiesQuery,
  type GetCommunitiesResponse,
} from '../../client/ApiTypes.js';
import {serializeCommunities} from './serializeCommunity.js';

const MAX_LIMIT = 10_000;

export async function getCommunities(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    search,
    limit,
    skip,
    sort,
    status,
    statusValidUntilFrom,
    statusValidUntilTo,
  } = request.query as GetCommunitiesQuery;
  const searchTerms = search ? search.split(' ') : [];
  const limitNumber = limit ? Number.parseInt(limit, 10) : 10;
  const skipNumber = skip ? Number.parseInt(skip, 10) : 0;
  const sortOrder = sort ?? 'name';

  const beginsWithSearchTerms =
    searchTerms.length > 0
      ? new RegExp(`^${searchTerms.join('|')}`, 'i')
      : undefined;

  const query: Record<string, unknown> = {};
  if (beginsWithSearchTerms) {
    query.name = beginsWithSearchTerms;
  }

  if (request.query.subscriptionEnds !== undefined) {
    const ends = request.query.subscriptionEnds === 'true';
    query['subscription.subscriptionEnds'] = ends ? true : {$ne: true};
  }

  if (status) {
    query['subscription.status'] = status;
  }

  if (statusValidUntilFrom ?? statusValidUntilTo) {
    query['subscription.statusValidUntil'] = {
      ...(statusValidUntilFrom ? {$gte: new Date(statusValidUntilFrom)} : {}),
      ...(statusValidUntilTo ? {$lte: new Date(statusValidUntilTo)} : {}),
    };
  }

  const sortOptions: Record<string, 1 | -1> = {};
  if (sortOrder === 'subscriptionStatusValidUntil') {
    sortOptions['subscription.statusValidUntil'] = 1;
  } else {
    sortOptions[sortOrder] = 1;
  }

  const communities = await Community.find({...query})
    .select([
      'name',
      'description',
      'language',
      'avatar',
      'timezone',
      'billingGroup',
      'subscription',
    ])
    .sort(sortOptions)
    .limit(Math.min(limitNumber, MAX_LIMIT))
    .skip(skipNumber);

  response.json(
    serializeCommunities(communities) satisfies GetCommunitiesResponse,
  );
}
