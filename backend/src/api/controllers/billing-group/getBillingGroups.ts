import {type Request, type Response} from 'express';
import {
  type GetBillingGroupsQuery,
  type GetBillingGroupsResponse,
} from '../../client/ApiTypes.js';
import {BillingGroup} from '../../../models/index.js';
import {serializeBillingGroups} from './serializeBillingGroup.js';

const MAX_LIMIT = 10_000;
const RECENT_DEFAULT_LIMIT = 20;

type BillingGroupSort = 'name' | 'recent';

const parseSort = (value: string | undefined): BillingGroupSort =>
  value === 'recent' ? 'recent' : 'name';

const parseLimit = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export async function getBillingGroups(
  request: Request,
  response: Response,
): Promise<void> {
  const {search, limit, sort} = request.query as GetBillingGroupsQuery;
  const searchTerms = search ? search.split(' ').filter(Boolean) : [];
  const sortMode = parseSort(sort);
  const explicitLimit = parseLimit(limit);
  const fallbackLimit =
    sortMode === 'recent' ? RECENT_DEFAULT_LIMIT : MAX_LIMIT;
  const resolvedLimit = explicitLimit ?? fallbackLimit;
  const limitNumber = Math.min(resolvedLimit, MAX_LIMIT);
  const beginsWithSearchTerms =
    searchTerms.length > 0
      ? new RegExp(`^${searchTerms.join('|')}`, 'i')
      : undefined;

  const billingGroups = await BillingGroup.find(
    beginsWithSearchTerms === undefined ? {} : {name: beginsWithSearchTerms},
  )
    .sort(sortMode === 'recent' ? '-updatedAt' : 'name')
    .limit(limitNumber);
  const serialized = await serializeBillingGroups(billingGroups);

  response.json(serialized satisfies GetBillingGroupsResponse);
}
