import {ADMIN_PATHS} from '../admin-paths';
import {Organization} from './Organization';
import {ORG_CONTROLLER_ROLE_ID, PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';

const PATH = ADMIN_PATHS.listOrganizations;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => {
    const user = await directus.users.me.read();
    const orgs = await directus.items('organization').readByQuery({
      fields: [
        'id',
        'slug',
        'default_language',
        'translation.name',
        'date_created',
        'join_short_code',
        'join_short_code_expires_at',
        'users.role',
        'users.last_dashboard_access',
        'users.user.first_name',
        'users.user.last_name',
        'users.user.email',
      ],
      filter: {
        created_from_admin_tools: {
          _eq: true,
        },
      },
      limit: -1,
      sort: ['-date_created'] as never,
    });
    return {user, orgs: orgs.data};
  });

function findLatestAccess(users: any) {
  let latestDate = new Date(0); // This initializes latestDate to the earliest possible date.
  for (const user of users) {
    const userAccessDate = new Date(user.last_dashboard_access);
    if (userAccessDate > latestDate) {
      latestDate = userAccessDate;
    }
  }

  return latestDate.getTime() > 0 ? latestDate.toISOString() : null;
}

function findExpirationInSeconds(item: any) {
  let expirationInSeconds: number | undefined;
  if (item.join_short_code_expires_at) {
    const expireDate = new Date(item.join_short_code_expires_at);
    const currentDate = new Date();
    const diffInMilliSeconds = expireDate.getTime() - currentDate.getTime();
    if (diffInMilliSeconds > 0) {
      expirationInSeconds = Math.floor(diffInMilliSeconds / 1000);
    }
  }

  return expirationInSeconds;
}

export default async function AdminOrganizationsPage() {
  const data = await getData();
  const role = data?.user?.role;

  if (!role || role !== ORG_CONTROLLER_ROLE_ID) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <div>access denied</div>
          <a
            href={`${PATHS.logout}?source=admin`}
            className="text-primary underline"
          >
            logout
          </a>
        </div>
      </main>
    );
  }

  const orgs: any[] =
    data.orgs?.map((org: any) => {
      const firstAdminUserLink = org.users.find((u: any) => u.role === 'admin');
      return {
        id: org.id,
        slug: org.slug,
        defaultLanguage: org.default_language,
        name: org.translation[0].name,
        created: org.date_created,
        numUsers: org.users.length,
        lastAccess: findLatestAccess(org.users),
        adminFirstName: firstAdminUserLink?.user.first_name,
        adminLastName: firstAdminUserLink?.user.last_name,
        adminEmail: firstAdminUserLink?.user.email,
        secondsStillActive: findExpirationInSeconds(org),
        joinShortCode: org.join_short_code,
      };
    }) ?? [];

  // console.log(orgs)

  return (
    <main className="flex flex-col p-4 sm:p-12 md:p-24">
      <div className="mb-12 flex flex-col items-center">
        <LinkButtonWithLoader
          href="/admin/organizations/new"
          className="mx-auto mb-4 max-w-sm bg-primary px-4 py-2 text-white"
        >
          Create a new organization
        </LinkButtonWithLoader>
        <a
          href={`${PATHS.logout}?source=admin`}
          className="text-primary underline"
        >
          logout
        </a>
      </div>
      <div className="container mx-auto max-w-3xl px-4">
        {orgs.map((org) => (
          <Organization
            key={org.id}
            org={org}
            index={0}
            className="bg-gray-50"
          />
        ))}
      </div>
    </main>
  );
}
