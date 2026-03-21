import {type Request, type Response} from 'express';
import {type RouteConfigs} from '../../../types/routeconfig.js';

const stripeWebHookController: RouteConfigs = {
  '/stripe-webhook': {
    post: {
      // eslint-disable-next-line func-name-matching, func-names
      controller: async function stripeWebHook(
        request: Request,
        response: Response,
      ): Promise<void> {
        // Placeholder webhook handler; will be implemented once Stripe events are defined.
        response.status(200).json({status: 'ok'});
      },
      access: ['public'],
    },
  },
};

export default stripeWebHookController;
