import {UsersList} from '../UsersList';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

export default async function DashboardHomeMembersPage() {
  return (
    <>
      <div className="p-8">
        <UsersList />
      </div>
      <AnalyticsEventRecorder event="router:home_members_page_loaded" />
    </>
  );
}
