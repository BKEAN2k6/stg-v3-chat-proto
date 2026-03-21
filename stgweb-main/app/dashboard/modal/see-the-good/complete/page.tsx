import {CompletePage} from './CompletePage';
import Confetti2 from '@/components/draft/confetti-2';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

export default async function DashboardSeeTheGoodCompletePage() {
  return (
    <>
      <div className="h-full overflow-y-auto rounded-lg bg-primary-lighter-3">
        <PageTransitionWrapper className="h-full">
          <CompletePage />
        </PageTransitionWrapper>
        <Confetti2 />
      </div>
      <AnalyticsEventRecorder event="routes:seethegood_complete_page_loaded" />
    </>
  );
}
