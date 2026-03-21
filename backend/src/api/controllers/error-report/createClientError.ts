import {type Request, type Response} from 'express';
import {type CreateClientErrorRequest} from '../../client/ApiTypes.js';

export async function createClientError(
  request: Request,
  response: Response,
): Promise<void> {
  const {error, environment} = request.body as CreateClientErrorRequest;
  // eslint-disable-next-line no-console
  console.log(`
--------------------------------------------------CLIENT ERROR REPORT---------------------------------------------------
User:
${JSON.stringify(request.user, null, 2)}
Error:
${JSON.stringify(error, null, 2)}
Environment:
${JSON.stringify(environment, null, 2)}
------------------------------------------------------------------------------------------------------------------------
`);
  response.sendStatus(200);
}
