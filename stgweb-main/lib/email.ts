import {PUBLIC_URL} from '@/constants.mjs';

const DEBUG = process.env.NODE_ENV === 'development';

type Parameters_ = {
  deliverImmediately: boolean;
  toAddress: string;
  fromAddress?: string;
  fromName?: string;
  templateName?: string;
  templateProps?: Record<string, string | number>;
};

export async function queueEmail(directus: any, parameters: Parameters_) {
  const {
    deliverImmediately,
    toAddress,
    fromAddress,
    fromName,
    templateName,
    templateProps,
  } = parameters;

  const newItem = {
    to_address: toAddress,
    // @TODO: change the default delivery address when seethegood.app domain is confirmed
    from_address: fromAddress ?? 'support@positive.fi',
    from_name: fromName ?? 'See The Good',
    template_name: templateName,
    template_props: templateProps,
  };
  const newItemCall = await directus
    .items('email_delivery_queue_item')
    .createOne(newItem);

  if (DEBUG) {
    console.log('queueEmail: queued', newItem);
  }

  if (deliverImmediately) {
    const deliveryQueueItemId = newItemCall.id;
    await fetch(
      `${PUBLIC_URL}/utils/trigger-email-delivery?id=${deliveryQueueItemId}`,
    );
  }
}
