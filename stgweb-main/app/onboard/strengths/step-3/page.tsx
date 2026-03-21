import {Carousel} from './Carousel';
import {shuffledAndPaddedStrengthSlugs} from '@/lib/strength-helpers';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

export default async function StrengthsOnboardingStep3Page() {
  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <Carousel
          items={shuffledAndPaddedStrengthSlugs().map((slug) => ({
            data: {slug},
            isPlaceholder: false,
          }))}
        />
      </PageTransitionWrapper>
    </div>
  );
}
