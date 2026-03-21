import {FetchLatestButton} from './FetchLatestButton';
import {TotalMomentsChart} from './TotalMomentsChart';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {sp} from '@/lib/utils';
import {ADMIN_PATHS} from '@/app/admin/admin-paths';

const PATH = ADMIN_PATHS.organizationStatistics;

type TimeSeriesData = {
  date_created: string;
  organization: string;
  total_strengths_seen_in_org_at_date: number;
  total_strengths_seen_in_selfs_at_date: number;
  total_strengths_seen_in_others_at_date: number;
  total_strengths_seen_in_org_to_date: number;
  total_strengths_seen_in_selfs_to_date: number;
  total_strengths_seen_in_others_to_date: number;
};

type UserToOrganization = {
  last_dashboard_access: string;
  user: {
    id: string;
    expires_at: string | undefined;
  };
};

type UserToGroup = {
  group: {
    id: string;
  };
};

type Session = {
  id: string;
  status: string;
};

const getData = async (slug: string) =>
  serverDataQueryWrapper(sp(PATH, {slug}), async (directus) => {
    const timeSeriesDataQuery = await directus
      .items('organization_timeseries_data')
      .readByQuery({
        filter: {
          organization: {
            slug: {
              _eq: slug,
            },
          },
        },
        limit: -1,
        sort: ['date_created'] as never,
      });

    const timeSeriesData =
      timeSeriesDataQuery.data as unknown as TimeSeriesData[];

    const userToOrganizationQuery = await directus
      .items('user_to_organization')
      .readByQuery({
        fields: ['last_dashboard_access', 'user.id', 'user.expires_at'],
        filter: {
          organization: {
            slug: {
              _eq: slug,
            },
          },
        },
        limit: -1,
      });

    const userLinks =
      userToOrganizationQuery.data as unknown as UserToOrganization[];

    const validUserIds = userLinks
      .filter((userLink) => !userLink.user.expires_at)
      .map((userLink) => userLink.user.id);

    // get all groups from users in the organization
    // REFACTORING NOTE: this will break after certain number of groups in an
    // organization (+200) since we are sending the validUserIds array over in
    // an http request and there's a limit of how much that pipe will take. See
    // the create-org-time-series-data route for a solution (batchQuery).
    let groupLinks: UserToGroup[] = [];
    if (validUserIds.length > 0) {
      const groupLinksQuery = await directus
        .items('user_to_group')
        .readByQuery({
          fields: ['group.id'],
          filter: {
            user: {
              _in: validUserIds,
            },
          },
          limit: -1,
        });
      groupLinks = groupLinksQuery.data as unknown as UserToGroup[];
    }

    const groupIds = groupLinks.map((groupLink) => groupLink.group.id);

    // get all sessions from groups in the organization
    // REFACTORING NOTE: this will break after certain number of groups in an
    // organization (+200) since we are sending the groupIds array over in
    // an http request and there's a limit of how much that pipe will take. See
    // the create-org-time-series-data route for a solution (batchQuery).
    let sprints: Session[] = [];
    if (groupIds.length > 0) {
      const sprintsQuery = await directus
        .items('strength_session')
        .readByQuery({
          fields: ['id', 'status'],
          filter: {
            group: {
              _in: groupIds,
            },
          },
          limit: -1,
        });
      sprints = sprintsQuery.data as unknown as Session[];
    }

    return {
      timeSeriesData,
      sprints,
      userLinks,
    };
  });

type Props = {
  params: {
    slug?: string;
  };
};

type DataBoxProps = {
  readonly label: React.ReactNode;
  readonly count: number;
};

const DataBox = ({label, count}: DataBoxProps) => (
  <div className="data-box m-2 min-w-[180px] rounded-md bg-gray-100 p-4 pb-2 shadow-md">
    <h3 className="mb-2 text-sm font-semibold text-gray-700">{label}</h3>
    <p className="count text-2xl font-bold text-gray-900">{count}</p>
  </div>
);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}`;
}

export default async function AdminOrganizationsSlugStatisticsPage(
  props: Props,
) {
  const data = await getData(props.params.slug ?? '');

  if (!data) {
    return <>error</>;
  }

  const validUsersCount = data.userLinks.filter(
    (userLink) => !userLink.user.expires_at,
  ).length;

  const pendingUsersCount = data.userLinks.filter(
    (userLink) => userLink.user.expires_at,
  ).length;

  const startedSprintsCount = data.sprints.length;

  const completedSprintsCount = data.sprints.filter(
    (sprint) => sprint.status === 'completed',
  ).length;

  const lastItem = data.timeSeriesData.at(-1);
  const strengthsToOrg = lastItem?.total_strengths_seen_in_org_to_date ?? 0; // prettier-ignore
  const strengthsToSelf = lastItem?.total_strengths_seen_in_selfs_to_date ?? 0; // prettier-ignore
  const strengthsToOthers = lastItem?.total_strengths_seen_in_others_to_date ?? 0; // prettier-ignore

  const chartData = data.timeSeriesData.map((item) => ({
    date: formatDate(item.date_created),
    strengthsSeen:
      item.total_strengths_seen_in_org_at_date +
      item.total_strengths_seen_in_selfs_at_date +
      item.total_strengths_seen_in_others_at_date,
  }));

  return (
    <div className="w-full py-4">
      <div className="mx-12 flex flex-col">
        <FetchLatestButton />
        <div className="mb-4 text-lg">Totals</div>
        <div className="flex flex-col">
          <div className="flex">
            {/* prettier-ignore */}
            <DataBox label={<>Users<br /><span className='text-xs'>(total)</span></>} count={validUsersCount} />
            {/* prettier-ignore */}
            <DataBox label={<>Users<br /><span className='text-xs'>(pending)</span></>} count={pendingUsersCount} />
          </div>
          <div className="flex">
            {/* prettier-ignore */}
            <DataBox
              label={<>Strengths seen<br /><span className='text-xs'>(total)</span></>}
              count={strengthsToOrg + strengthsToSelf + strengthsToOthers}
            />
            {/* prettier-ignore */}
            <DataBox label={<>Strengths seen<br /><span className='text-xs'>(org)</span></>} count={strengthsToOrg} />
            {/* prettier-ignore */}
            <DataBox label={<>Strengths seen<br /><span className='text-xs'>(self)</span></>} count={strengthsToSelf} />
            {/* prettier-ignore */}
            <DataBox label={<>Strengths seen<br /><span className='text-xs'>(others)</span></>} count={strengthsToOthers} />
          </div>
          <div className="flex">
            {/* prettier-ignore */}
            <DataBox label={<>Sprints<br /><span className='text-xs'>(started)</span></>} count={startedSprintsCount} />
            {/* prettier-ignore */}
            <DataBox label={<>Sprints<br /><span className='text-xs'>(completed)</span></>} count={completedSprintsCount} />
          </div>
        </div>
        <div className="mt-12 grow">
          <div className="mb-4 text-lg">Strengths seen per day</div>
          <TotalMomentsChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
}
