'use client';

import {usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {type StrengthSlug} from '@/lib/strength-data';
import {strengthSlugToReceivedText} from '@/lib/strength-helpers';
import {get} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useDashboard from '@/hooks/useDashboard';
import useWebSocket from '@/hooks/useWebSocket';

const texts = {
  aStrength: {
    'en-US': 'a strength',
    'sv-SE': 'styrkan',
    'fi-FI': 'vahvuutta',
  },
  sawStrengthInYou: {
    'en-US': 'saw {strength} in you!',
    'sv-SE': 'såg {strength} i dig!',
    'fi-FI': 'näki {strength} sinussa!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const MomentListener = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {getLoggedInUserId} = useAuth();
  const {dashboardState, setDashboardState} = useDashboard();
  const pathname = usePathname();
  useLegacyEffect(() => {
    // Hack to get rid of "flinching first toasts" effect... Basically the whole
    // screen would appear to "flinch" when the first toast would be added
    // here... Rendering one empty / invisible toast on the very start seems to
    // make the issue go away 🤷‍♂ ️
    setTimeout(() => {
      toast(' ', {
        duration: 1,
        style: {boxShadow: 'none', width: 0, height: 0},
      });
    });
  }, []);
  useWebSocket({
    uid: `allMoments-for-${getLoggedInUserId()}`,
    collection: 'websocket_event',
    query: {
      limit: 1,
      sort: ['-date_created'],
      fields: ['*'],
    },
    events: {
      // @NOTE: if a moment was sent both to user and wall, we only get one
      // event (not sure if it's always to the organization, but at least
      // while testing I saw only the one send to org). Not a huge issue
      // really, since supporting that kind of thing might not happen, or at
      // the very least be quite far off.
      async create(message) {
        const {data} = message;
        const createdItem = data?.[0];

        // not sure if this is necessary, but just a proof of concept that
        // something like this could be done quite easily... We'd likely want to
        // have the actual content as a reference to some more protected table
        // (every user can read websocket_events, and it's also to be cleaned up
        // on a daily basis)
        if (createdItem.type === 'superadmin-ping') {
          toast(createdItem.lookup_value);
          return;
        }

        const directus = createClientSideDirectusClient();

        // Check up on moments created to the wall of the active organization
        if (
          createdItem.type === 'moment_created' &&
          createdItem.listener_value ===
            dashboardState.userActiveOrganizationStrengthWallId
        ) {
          setDashboardState({organizationFeedHasNewContent: true});
        }

        // Check up on moments created to the wall of the user
        if (
          createdItem.type === 'moment_created' &&
          createdItem.listener_value === dashboardState.userStrengthWallId
        ) {
          // This is hacky, but if the user just happens to be chilling at the
          // inbox page and we see a new moment coming in, we refresh the
          // page...
          if (pathname === PATHS.inbox) {
            window.location.reload();
            return;
          }

          await refreshAuthIfExpired();

          // clear out the email delivery since user appears to be logged in and
          // about to see the notification

          try {
            await fetch('/utils/cancel-queued-email', {
              method: 'POST',
              body: JSON.stringify({
                templateNameStart: 'Strength received',
              }),
            });
          } catch {}

          // fetch moment data for the in-app notification
          const createdMoment = await directus
            .items('swl_moment')
            .readOne(createdItem.lookup_value, {
              fields: ['*', 'created_by.*', 'strengths.strength.*'],
            });

          // this will increment the strength counts on users profile page and
          // create a confetti effect.
          const slugs: StrengthSlug[] = [];
          const strengthLinks = createdMoment?.strengths;
          let delay = 0;

          for (const link of strengthLinks) {
            const slug = link.strength.slug;
            slugs.push(slug);
            setTimeout(() => {
              setDashboardState({
                lastIncrementedStrength: {
                  slug,
                  timestamp: Date.now(),
                },
              });
            }, delay);

            delay += 300;
          }

          // NOTE: it's important we look at the "created_by" field instead of
          // "user_created". Due to m2m complexity there's really no way to
          // grant permissions for users in the same organization to post to the
          // wall of anyone else, and is why posting to other users walls is
          // done through a separate endpoint using admin credentials and custom
          // authorization logic. Due to that, the "user_created" fields gets
          // the admin users id, and the "created_by" field is populated with
          // the id of the one actually creating the item.
          const createdById = get(createdMoment, 'created_by.id');
          if (createdById !== getLoggedInUserId()) {
            const createdByName = get<string>(
              createdMoment,
              'created_by.first_name',
              'Someone',
            );

            const strengthReceived = strengthSlugToReceivedText(
              slugs[0],
              locale,
            );

            // this will show a toast
            const strengthName = slugs[0]
              ? strengthReceived.toLowerCase()
              : t('aStrength', locale);

            toast(
              `${createdByName} ${t('sawStrengthInYou', locale).replace(
                '{strength}',
                strengthName,
              )}`,
              {
                icon: '👏',
              },
            );
          }
        }
      },
    },
  });
  return null;
};
