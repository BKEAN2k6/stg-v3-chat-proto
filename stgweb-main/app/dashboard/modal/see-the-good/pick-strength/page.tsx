import {SeeTheGoodStrengthCarousel} from './SeeTheGoodStrengthCarousel';
import {shuffledAndPaddedStrengthSlugs} from '@/lib/strength-helpers';
import {urlSafeBase64ToObject} from '@/lib/utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

type Props = {
  readonly searchParams?: {
    'target-data'?: string;
  };
};

const DashboardSeeTheGoodPickStrengthPage = (props: Props) => (
  <>
    <div className="pt-[120px]">
      <SeeTheGoodStrengthCarousel
        initialUserData={urlSafeBase64ToObject(
          props.searchParams?.['target-data'],
        )}
        items={shuffledAndPaddedStrengthSlugs().map((slug) => ({
          data: {slug},
          isPlaceholder: false,
        }))}
      />
    </div>
    <AnalyticsEventRecorder event="routes:seethegood_pick_strength_page_loaded" />
  </>
);

export default DashboardSeeTheGoodPickStrengthPage;
