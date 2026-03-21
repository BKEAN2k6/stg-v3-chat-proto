import {type Request, type Response} from 'express';
import {BillingContact} from '../../../models/index.js';
import {
  type GetBillingContactsQuery,
  type GetBillingContactsResponse,
} from '../../client/ApiTypes.js';

const MAX_LIMIT = 10_000;
const RECENT_DEFAULT_LIMIT = 20;

type BillingContactSort = 'name' | 'recent';

const parseSort = (value: string | undefined): BillingContactSort =>
  value === 'recent' ? 'recent' : 'name';

const parseLimit = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export async function getBillingContacts(
  request: Request,
  response: Response,
): Promise<void> {
  const {search, limit, sort} = request.query as GetBillingContactsQuery;
  const searchTerms = search ? search.split(' ').filter(Boolean) : [];
  const sortMode = parseSort(sort);
  const explicitLimit = parseLimit(limit);
  const fallbackLimit =
    sortMode === 'recent' ? RECENT_DEFAULT_LIMIT : MAX_LIMIT;
  const resolvedLimit = explicitLimit ?? fallbackLimit;
  const limitNumber = Math.min(resolvedLimit, MAX_LIMIT);
  const beginsWithSearchTerms = new RegExp(`^${searchTerms.join('|')}`, 'i');

  const query =
    searchTerms.length > 0
      ? BillingContact.find().or([{name: beginsWithSearchTerms}])
      : BillingContact.find();

  const billingContacts = await query
    .sort(sortMode === 'recent' ? '-updatedAt' : 'name')
    .limit(limitNumber);

  response.json(
    billingContacts.map((contact) =>
      contact.toJSON(),
    ) satisfies GetBillingContactsResponse,
  );
}
