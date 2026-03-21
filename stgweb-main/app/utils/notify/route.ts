import {type NextRequest} from 'next/server';
import {PATHS} from '@/constants.mjs';
import {
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from '@/lib/directus';
import {queueEmail} from '@/lib/email';
import {
  type LanguageCode,
  getLanguageDomain,
  getLocaleCode,
  mapLocaleCodeToLanguageCode,
} from '@/lib/locale';
import {respond} from '@/lib/server-only-utils';

// this whole thing is a bit dumb at the moment. Basically the need for this
// came from the fact that Directus websockets don't seem to reliably work
// with the permission setup we have. That's why we are dumping these
// notification events to a readable table through this and websocket
// subscribers will see them and act accordingly.

// also doubling as a way to queue notification emails.

// @TODO make sure user can't spam these events to the table (maybe one per minute or something like that is enough)
export async function POST(request: NextRequest) {
  // @TODO validate that users are in the same org
  const body = await request.json();
  const authToken = request.cookies.get('auth_token')?.value ?? '';
  const locale = getLocaleCode(request.cookies.get('locale')?.value ?? '');

  const userDirectus = await createServerSideDirectusClient({authToken});
  const adminDirectus = await createServerSideAdminDirectusClient();

  let loggedInUser;
  try {
    loggedInUser = await userDirectus.users.me.read({
      fields: ['id'],
    });
  } catch (error) {
    console.error(error);
    return respond(400, 'failed-to-fetch-logged-in-user');
  }

  const target = body.target;
  const peekAccessToken = body.peekAccessToken;
  const recipientId = body.recipientId;
  const wsocEventType = body.wsocEventType;
  const wsocEventListenerValue = body.wsocEventListenerValue;
  const wsocEventLookupValue = body.wsocEventLookupValue;

  if (wsocEventType === 'moment_created') {
    const momentId = wsocEventLookupValue;
    try {
      await adminDirectus.items('websocket_event').createOne({
        user_created: loggedInUser.id,
        type: wsocEventType,
        listener_value: wsocEventListenerValue,
        lookup_value: wsocEventLookupValue,
      });
      if (target === 'other') {
        // locale should actually be read from the recipient users
        // default_locale when we store that
        const languageCode = mapLocaleCodeToLanguageCode[locale];
        const urlDomain = getLanguageDomain(true, languageCode as LanguageCode);
        const recipient: any = await adminDirectus
          .items('directus_users')
          .readOne(recipientId);
        // queue email notification about new moment

        // NOTE: looking at "expires_at" this not a complete solution to this...
        // Basically the issue was that since every user needs an email to begin
        // with, we use addresses like
        // somethingrandom+somethingrandom@seethegood.app for those users that
        // haven't completed the registration. Well, the users that haven't
        // completed are also visible on the organizations user listing, and
        // then we got an some bounces due to trying to send email to these
        // random addresses that don't exist. Now we just trust that users that
        // have the "expires_at" cleared are fine to send to, but that might not
        // always hold true....
        if (!recipient.expires_at) {
          await queueEmail(adminDirectus, {
            deliverImmediately: false,
            toAddress: recipient?.email,
            templateName: `Strength received (${locale})`,
            templateProps: {
              url: `${urlDomain}${PATHS.peekMomentToken.replace(
                '[token]',
                peekAccessToken,
              )}?mid=${momentId}`,
            },
          });
        }
      }

      return respond(200, 'ok');
    } catch {
      return respond(400, 'failed');
    }
  }

  return respond(400, 'error');
}
