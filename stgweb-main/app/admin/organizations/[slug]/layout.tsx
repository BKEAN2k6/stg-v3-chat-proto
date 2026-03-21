import {type ReactNode} from 'react';
import {ADMIN_PATHS} from '../../admin-paths';
import {OrgDetailsLayout} from './OrgDetailsLayout';
import {ORG_CONTROLLER_ROLE_ID} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {sp} from '@/lib/utils';

type Props = {
  children: ReactNode;
  params: {
    slug?: string;
  };
};

const getData = async (slug: string) =>
  serverDataQueryWrapper(
    sp(ADMIN_PATHS.organizationUsers, {slug}),
    async (directus) => {
      const user = await directus.users.me.read();
      const org = await directus.items('organization').readByQuery({
        fields: ['id', 'translation.name'],
        filter: {
          _and: [
            {
              created_from_admin_tools: {
                _eq: true,
              },
            },
            {
              slug: {
                _eq: slug,
              },
            },
          ],
        },
        limit: -1,
        sort: ['-date_created'] as never,
      });
      return {user, org: org.data?.[0]};
    },
  );

export default async function AdminOrganizationsSlugLayout(props: Props) {
  const {children, params} = props;
  const data = await getData(params.slug ?? '');

  if (data?.user.role !== ORG_CONTROLLER_ROLE_ID) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        access denied
      </main>
    );
  }

  return (
    <OrgDetailsLayout orgName={data?.org.translation[0].name}>
      {children}
    </OrgDetailsLayout>
  );
}
