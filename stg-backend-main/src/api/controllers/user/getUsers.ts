import {type Request, type Response} from 'express';
import {User} from '../../../models';
import {type GetUsersQuery, type GetUsersResponse} from '../../client/ApiTypes';

const MAX_LIMIT = 1000;

export async function getUsers(
  request: Request,
  response: Response,
): Promise<void> {
  const {search, limit, skip, sort} = request.query as GetUsersQuery;
  const searchTerms = search ? search.split(' ') : [];
  const limitNumber = limit ? Number.parseInt(limit, 10) : 10;
  const skipNumber = skip ? Number.parseInt(skip, 10) : 0;
  const sortOrder = sort ?? 'firstName lastName email';

  const beginsWithSearchTerms = new RegExp(`^${searchTerms.join('|')}`, 'i');
  const users = await User.find()
    .or([
      {firstName: beginsWithSearchTerms},
      {lastName: beginsWithSearchTerms},
      {email: beginsWithSearchTerms},
    ])
    .sort(sortOrder)
    .limit(limitNumber < MAX_LIMIT ? limitNumber : MAX_LIMIT)
    .skip(skipNumber);

  response.json(users.map((user) => user.toJSON()) satisfies GetUsersResponse);
}
