import {type Request, type Response} from 'express';
import {
  type CreateBillingContactRequest,
  type CreateBillingContactResponse,
} from '../../client/ApiTypes.js';
import {BillingContact} from '../../../models/index.js';

export async function createBillingContact(
  request: Request,
  response: Response,
): Promise<void> {
  const payload = request.body as CreateBillingContactRequest;

  const billingContact = await BillingContact.create({
    name: payload.name,
    email: payload.email,
    crmLink: payload.crmLink,
    notes: payload.notes,
  });

  response
    .status(201)
    .json(billingContact.toJSON() satisfies CreateBillingContactResponse);
}
