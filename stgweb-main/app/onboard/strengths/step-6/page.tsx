import {Reward} from './Reward';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

export default async function StrengthsOnboardingStep6Page() {
  return (
    <div className="min-safe-h-screen z-10 w-screen bg-primary-lighter-3">
      <PageTransitionWrapper>
        <Reward />
      </PageTransitionWrapper>
    </div>
  );
}
