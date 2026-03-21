import {type Request, type Response} from 'express';
import {Community} from '../../../models';
import {
  type GetCommunitiesQuery,
  type GetCommunitiesResponse,
} from '../../client/ApiTypes';

const MAX_LIMIT = 1000;

export async function getCommunities(
  request: Request,
  response: Response,
): Promise<void> {
  const {search, limit, skip, sort} = request.query as GetCommunitiesQuery;
  const searchTerms = search ? search.split(' ') : [];
  const limitNumber = limit ? Number.parseInt(limit, 10) : 10;
  const skipNumber = skip ? Number.parseInt(skip, 10) : 0;
  const sortOrder = sort ?? 'name';

  const beginsWithSearchTerms = new RegExp(`^${searchTerms.join('|')}`, 'i');
  const communities = await Community.find()
    .or([{name: beginsWithSearchTerms}])
    .sort(sortOrder)
    .limit(limitNumber < MAX_LIMIT ? limitNumber : MAX_LIMIT)
    .skip(skipNumber);

  response.json(
    communities.map((community) =>
      community.toJSON(),
    ) satisfies GetCommunitiesResponse,
  );
}
