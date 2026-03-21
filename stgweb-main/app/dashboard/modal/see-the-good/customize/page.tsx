'use client';

import {CustomizePage} from './CustomizePage';
import {type StrengthSlug} from '@/lib/strength-data';
import {urlSafeBase64ToObject} from '@/lib/utils';
import {CarouselContextProvider} from '@/components/carousel/CarouselContext';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

type Props = {
  readonly searchParams?: {
    'target-data'?: string;
    strength: string;
  };
};

const DashboardSeeTheGoodAddMCommentPage = (props: Props) => (
  <>
    <div className="pt-[120px]">
      {/* it's slightly unintuitive that we continue using the carousel
        context here... These selected items should be separated to their own
        context */}
      <CarouselContextProvider
        initialState={{
          // @TODO some shared handler to redirect user away from these routes if these are invalid
          selectedStrengthSlug: props.searchParams?.strength as StrengthSlug,
          selectedUserData: urlSafeBase64ToObject(
            props.searchParams?.['target-data'],
          ),
        }}
      >
        <CustomizePage />
      </CarouselContextProvider>
    </div>
    <AnalyticsEventRecorder event="routes:seethegood_customize_page_loaded" />
  </>
);

export default DashboardSeeTheGoodAddMCommentPage;
