import {type Request, type Response} from 'express';
import {type RemoveBillingContactParameters} from '../../client/ApiTypes.js';
import {BillingContact, BillingGroup} from '../../../models/index.js';

export async function removeBillingContact(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as unknown as RemoveBillingContactParameters;

  const billingContact = await BillingContact.findById(id);

  if (!billingContact) {
    response.status(404).json({error: 'Billing contact not found'});
    return;
  }

  const hasGroups = await BillingGroup.exists({
    billingContact: billingContact._id,
  });

  if (hasGroups) {
    response.status(400).json({
      error:
        'Billing contact cannot be removed while it is linked to billing groups',
    });
    return;
  }

  await billingContact.deleteOne();

  response.sendStatus(204);
}
