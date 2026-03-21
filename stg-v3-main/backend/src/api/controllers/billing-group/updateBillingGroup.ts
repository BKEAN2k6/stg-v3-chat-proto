import {type Request, type Response} from 'express';
import {
  type UpdateBillingGroupParameters,
  type UpdateBillingGroupRequest,
  type UpdateBillingGroupResponse,
} from '../../client/ApiTypes.js';
import {BillingContact, BillingGroup} from '../../../models/index.js';
import {serializeBillingGroup} from './serializeBillingGroup.js';

export async function updateBillingGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as unknown as UpdateBillingGroupParameters;
  const payload = request.body as UpdateBillingGroupRequest;

  const billingGroup = await BillingGroup.findById(id);

  if (!billingGroup) {
    response.status(404).json({error: 'Billing group not found'});
    return;
  }

  if (payload.billingContactId) {
    const billingContact = await BillingContact.findById(
      payload.billingContactId,
    );

    if (!billingContact) {
      response.status(404).json({error: 'Billing contact not found'});
      return;
    }

    billingGroup.billingContact = billingContact._id;
  }

  if (payload.name !== undefined) {
    billingGroup.name = payload.name;
  }

  if (payload.notes !== undefined) {
    billingGroup.notes = payload.notes;
  }

  await billingGroup.save();

  const serialized = await serializeBillingGroup(billingGroup);

  response.json(serialized satisfies UpdateBillingGroupResponse);
}
