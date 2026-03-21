import {GroupsPage} from './GroupsPage';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

export default async function DashboardHomeGroupsPage() {
  return (
    <>
      <GroupsPage />
      <AnalyticsEventRecorder event="router:home_groups_page_loaded" />
    </>
  );
}
