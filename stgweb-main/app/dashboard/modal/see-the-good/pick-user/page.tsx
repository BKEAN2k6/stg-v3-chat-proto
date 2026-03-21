import {SeeTheGoodUserCarousel} from './SeeTheGoodUserCarousel';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

const DashboardSeeTheGoodPickUserPage = () => (
  <div className="pt-[120px]">
    <SeeTheGoodUserCarousel />
    <AnalyticsEventRecorder event="routes:seethegood_pick_user_page_loaded" />
  </div>
);

export default DashboardSeeTheGoodPickUserPage;
