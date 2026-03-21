import {Buttons} from './Buttons';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

const DashboardSeeTheGoodStartPage = () => (
  <div className="h-[calc(100%_-_120px)] pt-[120px]">
    <div className="flex h-full w-full flex-col items-center md:flex-row md:justify-center">
      <Buttons />
      <AnalyticsEventRecorder event="routes:seethegood_start_page_loaded" />
    </div>
  </div>
);

export default DashboardSeeTheGoodStartPage;
