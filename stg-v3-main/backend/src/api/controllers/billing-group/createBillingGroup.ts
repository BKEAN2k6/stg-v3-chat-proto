import {type Request, type Response} from 'express';
import {
  type CreateBillingGroupRequest,
  type CreateBillingGroupResponse,
} from '../../client/ApiTypes.js';
import {BillingContact, BillingGroup} from '../../../models/index.js';
import {serializeBillingGroup} from './serializeBillingGroup.js';

export async function createBillingGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const payload = request.body as CreateBillingGroupRequest;

  const billingContact = await BillingContact.findById(
    payload.billingContactId,
  );

  if (!billingContact) {
    response.status(404).json({error: 'Billing contact not found'});
    return;
  }

  const billingGroup = await BillingGroup.create({
    name: payload.name,
    billingContact: billingContact._id,
    notes: payload.notes,
  });

  const serialized = await serializeBillingGroup(billingGroup);

  response.status(201).json(serialized satisfies CreateBillingGroupResponse);
}
