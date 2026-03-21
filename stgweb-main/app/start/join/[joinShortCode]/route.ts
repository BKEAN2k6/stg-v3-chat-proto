import crypto from 'node:crypto';
import {redirect} from 'next/navigation';
import {type NextRequest} from 'next/server';
import {
  PATHS,
  USER_ROLE_ID,
  USER_SWL_MEDIA_PARENT_FOLDER_ID,
} from '@/constants.mjs';
import {
  getAllUsedSlugAndColorPairs,
  getRandomSlugColorPair,
} from '@/lib/avatar-helpers';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

// this will either return to /start/join?error= with return one of:
// - org-not-found
// - code-expired
// - failed-to-create-user
// - failed-to-link-user-to-org

// Or it'll succeed and continue to /start/hello?e=EMAIL&p=PASS

// eslint-disable-next-line complexity
export async function GET(
  _: NextRequest,
  {params}: {params: {joinShortCode: string}},
) {
  const t = Date.now();
  const directus = await createServerSideAdminDirectusClient();

  // Find org by "join short code"
  const organizationQuery = await directus.items('organization').readByQuery({
    filter: {
      join_short_code: {
        _eq: params.joinShortCode,
      },
    },
  });

  let organization: any;
  if (organizationQuery.data?.length === 1) {
    organization = organizationQuery.data?.[0];
  }

  // Find group by "join short code"
  const groupQuery = await directus.items('group').readByQuery({
    filter: {
      join_short_code: {
        _eq: params.joinShortCode,
      },
    },
  });

  let group: any;
  if (groupQuery.data?.length === 1) {
    group = groupQuery.data?.[0];
  }

  // bail out here if neither organization or group is found
  if (!organization && !group) {
    return redirect(`${PATHS.joinOrganizationStart}?error=not-found&t=${t}`);
  }

  const isOrgUser = Boolean(organization);
  const isGroupUser = Boolean(group);

  // for group users, find the latest started strength session
  let strengthSession: any;
  if (isGroupUser) {
    const strengthSessionQuery = await directus
      .items('strength_session')
      .readByQuery({
        filter: {
          _and: [
            {
              group: {
                _eq: group.id,
              },
            },
            {
              status: {
                _eq: 'started',
              },
            },
          ],
        },
      });
    if (strengthSessionQuery.data?.length === 1) {
      strengthSession = strengthSessionQuery.data?.[0];
    } else {
      // if we found a group with the code but it doesn't have a session in a
      // started state, we should bail
      // NOTE: could be some different error maybe
      return redirect(`${PATHS.joinOrganizationStart}?error=not-found&t=${t}`);
    }
  }

  const organizationOrGroup = organization || group;

  const now = new Date();
  const joinShortCodeExpiration = new Date(
    organizationOrGroup.join_short_code_expires_at,
  );
  if (now > joinShortCodeExpiration) {
    return redirect(`${PATHS.joinOrganizationStart}?error=code-expired&t=${t}`);
  }

  const randomEmailString = crypto.randomBytes(8).toString('hex');
  const email = `${randomEmailString}+${Date.now()}@positive.fi`;

  const randomPasswordString = crypto.randomBytes(16).toString('hex');
  const password = `${randomPasswordString}${Date.now()}`;

  // example outputs:
  // email d319eab44679b689f6cedf0ab56d63e2+1689341977396@positive.fi
  // password a6953afc39609ab8153a04a863519c941689341977396

  const ONE_WEEK_IN_MILLIS = 7 * 24 * 60 * 60 * 1000; // 7 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
  const ms = Date.now() + ONE_WEEK_IN_MILLIS;
  const accountExpirationDate = new Date(ms);

  // @TODO make this work similarly with groups and orgs
  let newAvatarSlugAndColorPair: {slug?: string; color?: string} = {};
  if (isOrgUser) {
    const usedAvatarSlugAndColorPairs = await getAllUsedSlugAndColorPairs(
      directus,
      organization.id,
    );
    newAvatarSlugAndColorPair = getRandomSlugColorPair(
      usedAvatarSlugAndColorPairs,
    );
  }

  if (isGroupUser) {
    newAvatarSlugAndColorPair = getRandomSlugColorPair([]);
  }

  // Create the user
  let newUserQuery: any;
  const newUserId = crypto.randomUUID();
  try {
    newUserQuery = await directus.items('directus_users').createOne({
      id: newUserId,
      email,
      password,
      role: USER_ROLE_ID,
      avatar_slug: newAvatarSlugAndColorPair.slug,
      color: newAvatarSlugAndColorPair.color,
      // for organization users, set active organization
      ...(isOrgUser ? {active_organization: organization.id} : {}),
      // for group users, set active group and strength session
      ...(isGroupUser
        ? {
            active_group: group.id,
            active_strength_session: strengthSession.id,
            is_strength_session_user: true,
          }
        : {}),
      // swl_wall: { create: [{ test: "value" }] },
      swl_wall: {
        media_folder: {
          name: `user_${newUserId.slice(0, 8)}_swl_media`,
          parent: USER_SWL_MEDIA_PARENT_FOLDER_ID,
        },
      },
      // NOTE: we use this value to set an expiration date for users that just
      // join, but never do anything else (due to random network issues, testing
      // etc.) expiration date is set to null when users finally sets email and
      // password after some onboarding steps, making the account "official"
      // NOTE: group users don't expire
      expires_at: isOrgUser ? accountExpirationDate : null,
    });
  } catch {
    // @TODO logging
  }

  if (!newUserQuery) {
    return redirect(
      `${PATHS.joinOrganizationStart}?error=failed-to-create-user&t=${t}`,
    );
  }

  // Add the user to the organization
  if (isOrgUser) {
    const userToOrganizationLinkQuery = await directus
      .items('user_to_organization')
      .createOne({
        user: newUserQuery.id,
        organization: organization.id,
      });

    if (!userToOrganizationLinkQuery) {
      return redirect(
        `${PATHS.joinOrganizationStart}?error=failed-to-link-user-to-org&t=${t}`,
      );
    }
  }

  if (isGroupUser) {
    const userToGroupLinkQuery = await directus
      .items('user_to_group')
      .createOne({
        user: newUserQuery.id,
        group: group.id,
      });

    if (!userToGroupLinkQuery) {
      return redirect(
        `${PATHS.joinOrganizationStart}?error=failed-to-link-user-to-group&t=${t}`,
      );
    }
  }

  if (isOrgUser) {
    return redirect(`${PATHS.joinOrganizationStep1}?e=${encodeURIComponent(email)}&p=${encodeURIComponent(password)}`);
  } // prettier-ignore

  if (isGroupUser) {
    return redirect(`${PATHS.strengthSessionPlayerHello.replace('[sessionId]', strengthSession.id)}?e=${encodeURIComponent(email)}&p=${encodeURIComponent(password)}`);
  } // prettier-ignore

  return respond(400, 'failed');
}
