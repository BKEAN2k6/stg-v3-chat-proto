import {type Request, type Response} from 'express';
import {
  type UpdateBillingContactParameters,
  type UpdateBillingContactRequest,
  type UpdateBillingContactResponse,
} from '../../client/ApiTypes.js';
import {BillingContact} from '../../../models/index.js';

export async function updateBillingContact(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as unknown as UpdateBillingContactParameters;
  const payload = request.body as UpdateBillingContactRequest;

  const billingContact = await BillingContact.findById(id);

  if (!billingContact) {
    response.status(404).json({error: 'Billing contact not found'});
    return;
  }

  if (payload.name !== undefined) {
    billingContact.name = payload.name;
  }

  if (payload.email !== undefined) {
    billingContact.email = payload.email;
  }

  if (payload.crmLink !== undefined) {
    billingContact.crmLink = payload.crmLink;
  }

  if (payload.notes !== undefined) {
    billingContact.notes = payload.notes;
  }

  await billingContact.save();

  response.json(billingContact.toJSON() satisfies UpdateBillingContactResponse);
}
