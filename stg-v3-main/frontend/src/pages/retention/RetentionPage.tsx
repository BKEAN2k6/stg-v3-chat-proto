import {useState, useEffect} from 'react';
import {Table} from 'react-bootstrap';
import api from '@client/ApiClient';
import {type NewUsers, type GetUserRetentionResponse} from '@client/ApiTypes';
import {getWeek, getMonth, getDate} from 'date-fns';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';
import CenteredLoader from '@/components/CenteredLoader.js';
import countries from '@/countries.js';

const formatDate = (isoDate: string, type: 'weekly' | 'monthly' | 'daily') => {
  const date = new Date(isoDate);

  switch (type) {
    case 'daily': {
      return `Day ${getDate(date)}`;
    }

    case 'weekly': {
      return `Week ${getWeek(date)}`;
    }

    case 'monthly': {
      return `Month ${getMonth(date) + 1}`;
    }
  }
};

export default function RetentionPage() {
  const toasts = useToasts();
  const [data, setData] = useState<GetUserRetentionResponse | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchRetentionData = async () => {
      try {
        const response = await api.getUserRetention();
        setData(response);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching retention data',
        });
      }
    };

    void fetchRetentionData();
  }, [toasts]);

  type RetentionData = {
    date: string;
    interval: number;
    visitors: number;
    returnVisitors: number;
    percentage: number;
  };

  type TopUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    visitCount: number;
    country: string;
  };

  const renderTopUserTable = (topUsers: TopUser[]) => {
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Country</th>
            <th>Visits</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td style={{wordBreak: 'break-all'}}>{user.email}</td>
              <td>{user.organization}</td>
              <td>
                {
                  countries.find((country) => country.code === user.country)
                    ?.name
                }
              </td>
              <td>{user.visitCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderNewUserTable = (newUsers: NewUsers) => {
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Country</th>
            <th>Registered At</th>
          </tr>
        </thead>
        <tbody>
          {newUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td style={{wordBreak: 'break-all'}}>{user.email}</td>
              <td>{user.organization}</td>
              <td>
                {
                  countries.find((country) => country.code === user.country)
                    ?.name
                }
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderCohortTable = (
    retentionData: RetentionData[],
    type: 'weekly' | 'monthly' | 'daily',
  ) => {
    const groupedData: Record<
      string,
      {
        formattedDate: string;
        originalDate: string;
        total: number;
        data: Record<string, string>;
      }
    > = {};

    for (const row of retentionData) {
      const formattedDate = formatDate(row.date, type);

      groupedData[row.date] ||= {
        formattedDate,
        originalDate: row.date,
        total: row.visitors,
        data: {},
      };

      if (row.interval !== 0) {
        groupedData[row.date].data[row.interval] = row.percentage.toFixed(0);
      }
    }

    const intervals = new Set<string>();
    for (const entry of Object.values(groupedData)) {
      for (const key of Object.keys(entry.data)) intervals.add(key);
    }

    return (
      <>
        <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
        <Table bordered hover>
          <thead>
            <tr>
              <th>
                {(() => {
                  switch (type) {
                    case 'weekly': {
                      return 'Week';
                    }

                    case 'monthly': {
                      return 'Month';
                    }

                    case 'daily': {
                      return 'Day';
                    }
                  }
                })()}
              </th>
              <th>Total</th>
              {[...intervals].map((interval) => (
                <th key={interval}>{interval}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedData)
              .sort(
                (a, b) =>
                  new Date(a.originalDate).getTime() -
                  new Date(b.originalDate).getTime(),
              )
              .map(({formattedDate, total, data}) => (
                <tr key={formattedDate}>
                  <td>{formattedDate}</td>
                  <td>{total}</td>
                  {[...intervals].map((interval) => (
                    <td
                      key={interval}
                      style={{
                        background: `rgba(0, 128, 0, ${Number(data[interval]) / 100})`,
                      }}
                    >
                      {data[interval] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="User Retention" />

      {data ? (
        <>
          <h3>Users registered</h3>
          {renderCohortTable(data.registeredUsers.daily, 'daily')}
          {renderCohortTable(data.registeredUsers.weekly, 'weekly')}
          {renderCohortTable(data.registeredUsers.monthly, 'monthly')}
          <h3>Users seen</h3>
          {renderCohortTable(data.allUsers.daily, 'daily')}
          {renderCohortTable(data.allUsers.weekly, 'weekly')}
          {renderCohortTable(data.allUsers.monthly, 'monthly')}
          <h3>Existing users (excluding new registrations)</h3>
          {renderCohortTable(data.existingUsers.daily, 'daily')}
          {renderCohortTable(data.existingUsers.weekly, 'weekly')}
          {renderCohortTable(data.existingUsers.monthly, 'monthly')}
          <h3>Most Active Users</h3>
          <h4>Past 12 days</h4>
          {renderTopUserTable(data.topUsers.daily)}
          <h4>Past 12 Weeks</h4>
          {renderTopUserTable(data.topUsers.weekly)}
          <h4>Past 12 Months</h4>
          {renderTopUserTable(data.topUsers.monthly)}
          <h3>New Users</h3>
          {renderNewUserTable(data.newUsers)}
        </>
      ) : (
        <CenteredLoader />
      )}
    </div>
  );
}
