import {type Request, type Response} from 'express';
import {type RemoveBillingGroupParameters} from '../../client/ApiTypes.js';
import {BillingGroup, Community} from '../../../models/index.js';

export async function removeBillingGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as unknown as RemoveBillingGroupParameters;

  const billingGroup = await BillingGroup.findById(id);

  if (!billingGroup) {
    response.status(404).json({error: 'Billing group not found'});
    return;
  }

  const hasCommunities = await Community.exists({
    billingGroup: billingGroup._id,
  });

  if (hasCommunities) {
    response.status(400).json({
      error: 'Billing group cannot be removed while it has communities',
    });
    return;
  }

  await billingGroup.deleteOne();

  response.sendStatus(204);
}
