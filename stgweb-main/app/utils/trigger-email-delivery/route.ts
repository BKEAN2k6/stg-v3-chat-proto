import {type NextRequest} from 'next/server';
import configureSidemail from 'sidemail';
import {IS_STAGING_OR_PRODUCTION} from '@/constants.mjs';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {flushToSentry, logToSentry} from '@/lib/log';
import {getUrlFromRequest, respond} from '@/lib/server-only-utils';

const DEBUG = process.env.NODE_ENV === 'development';

const sidemail = configureSidemail({
  apiKey: process.env.SIDEMAIL_API_KEY ?? 'mock-key',
});

/* eslint no-await-in-loop: 0 */

export async function GET(request: NextRequest) {
  const {searchParams} = getUrlFromRequest(request);

  const deliveryQueueItemId = searchParams.get('id');

  const directus = await createServerSideAdminDirectusClient();

  let itemsToDeliver: any[] = [];

  // look up the specific item to delivery by id
  if (deliveryQueueItemId) {
    let itemQuery: any;
    try {
      itemQuery = await directus
        .items('email_delivery_queue_item')
        .readOne(deliveryQueueItemId);
    } catch (error) {
      console.error(error);
      await logToSentry(error as Error);
      return respond(404, 'item-not-found');
    }

    if (itemQuery && itemQuery.status === 'PENDING') {
      itemsToDeliver.push(itemQuery);
    }
  }

  // look up last 5 pending items deliveryQueueItemId not specified
  if (!deliveryQueueItemId) {
    let deliveryQueueItemsQuery;
    try {
      deliveryQueueItemsQuery = await directus
        .items('email_delivery_queue_item')
        .readByQuery({
          fields: ['*'],
          filter: {status: 'PENDING'},
          limit: 5,
        });
    } catch (error) {
      console.error(error);
      await logToSentry(error as Error);
      return respond(400, 'failed');
    }

    if (deliveryQueueItemsQuery.data) {
      itemsToDeliver = deliveryQueueItemsQuery.data;
    }
  }

  if (DEBUG) {
    console.log('trigger-email-delivery: itemsToDeliver', itemsToDeliver);
  } // prettier-ignore

  let successfulDeliveries = 0;
  let failedDeliveries = 0;
  if (itemsToDeliver.length > 0) {
    for (const item of itemsToDeliver) {
      // try to delivery with sidemail
      const sendEmailParameters = {
        toAddress: item.to_address,
        fromAddress: item.from_address,
        fromName: item.from_name,
        templateName: item.template_name,
        templateProps: item.template_props,
      };

      if (DEBUG) {
        console.log('trigger-email-delivery: sendEmailParams', sendEmailParameters);
      } // prettier-ignore

      let deliveryCall;
      let success = false;
      try {
        deliveryCall = IS_STAGING_OR_PRODUCTION
          ? await sidemail.sendEmail(sendEmailParameters)
          : {status: 'queued'};
      } catch (error) {
        const message = (error as Error).message;
        console.error(`email delivery failed with ${message}, item ${item.id}`);
        logToSentry(error as Error, true);
      }

      if (deliveryCall?.status === 'queued') {
        try {
          await directus.items('email_delivery_queue_item').updateOne(item.id, {
            status: 'DELIVERED',
          });
          success = true;
        } catch (error) {
          console.error(error);
          logToSentry(error as Error, true);
        }
      } else {
        try {
          await directus.items('email_delivery_queue_item').updateOne(item.id, {
            status: 'FAILURE',
            failure_info: {
              deliveryCall,
            },
          });
        } catch (error) {
          logToSentry(error as Error, true);
        }
      }

      if (success) {
        successfulDeliveries += 1;
      } else {
        failedDeliveries += 1;
      }
    }
  }

  await flushToSentry();

  return respond(200, 'ok', {successfulDeliveries, failedDeliveries});
}
