import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

export default async function StrengthsOnboardingThanksPage() {
  return (
    <div className="min-safe-h-screen z-10 w-screen bg-primary-lighter-3">
      <PageTransitionWrapper>
        <FullHeightCentered>
          <h1 className="text-2xl font-bold">Kiitos!</h1>
        </FullHeightCentered>
      </PageTransitionWrapper>
    </div>
  );
}
