import {type NextRequest} from 'next/server';
import {
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

// simple action that takes a template name part and cancels any pending email
// delivery. This is used in cases where the user is logged in and gets already
// gets a notification of the received strength, so we don't unnecessarily
// deliver an email to them.

export async function POST(request: NextRequest) {
  // @TODO validate that users are in the same org
  const body = await request.json();
  const authToken = request.cookies.get('auth_token')?.value ?? '';

  const userDirectus = await createServerSideDirectusClient({authToken});
  const adminDirectus = await createServerSideAdminDirectusClient();

  const templateNameStart = body.templateNameStart;

  let loggedInUser;
  try {
    loggedInUser = await userDirectus.users.me.read({
      fields: ['id'],
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-logged-in-user');
  }

  if (!loggedInUser.id) {
    return respond(400, 'failed-to-fetch-logged-in-user');
  }

  // This next part of fetching the user again with the admin creds is needed
  // due to the fact that logged in user can't read their own email address.
  // That's due to the limitations of Directus permission system (we can only
  // give one type of a permission to user to one table, so to limit access to
  // all users emails within the same organization, we need can't give read
  // access to the email field)
  let recipientUser;
  try {
    recipientUser = await adminDirectus
      .items('directus_users')
      .readOne(loggedInUser.id, {
        fields: ['email'],
      });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-logged-in-user');
  }

  let canceled = 0;
  try {
    const queueItems = await adminDirectus
      .items('email_delivery_queue_item')
      .readByQuery({
        filter: {
          _and: [
            {
              status: {
                _eq: 'PENDING',
              },
            },
            {
              to_address: {
                _eq: recipientUser?.email,
              },
            },
            {
              template_name: {
                _starts_with: templateNameStart,
              },
            },
          ],
        },
      });
    // not super optimal, but since this is solving a sort of an edge case, it
    // should be fine to cancel all the pending items of the same template for
    // the user whenever this is called once...
    const queueItemsLength = queueItems.data?.length ?? 0;

    for (let idx = 0; idx < queueItemsLength; idx += 1) {
      const queueItem: any = queueItems.data?.[idx];
      // eslint-disable-next-line no-await-in-loop
      await adminDirectus
        .items('email_delivery_queue_item')
        .updateOne(queueItem?.id || '', {
          status: 'CANCELED',
        });
      canceled += 1;
    }
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-or-update-queue-item');
  }

  return respond(200, 'ok', {canceled});
}
