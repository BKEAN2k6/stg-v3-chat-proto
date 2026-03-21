import {type Request, type Response} from 'express';
import {
  type GetBillingGroupParameters,
  type GetBillingGroupResponse,
} from '../../client/ApiTypes.js';
import {BillingGroup} from '../../../models/index.js';
import {serializeBillingGroup} from './serializeBillingGroup.js';

export async function getBillingGroup(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as unknown as GetBillingGroupParameters;

  const billingGroup = await BillingGroup.findById(id);

  if (!billingGroup) {
    response.status(404).json({error: 'Billing group not found'});
    return;
  }

  const serialized = await serializeBillingGroup(billingGroup);

  response.json(serialized satisfies GetBillingGroupResponse);
}
