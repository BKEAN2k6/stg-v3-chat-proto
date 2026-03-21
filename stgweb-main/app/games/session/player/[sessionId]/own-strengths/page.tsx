import {OwnStrengthsPage} from './OwnStrengthsPage';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdOwnStrengthsPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <OwnStrengthsPage sessionId={sessionId} />
      </PageTransitionWrapper>
    </div>
  );
}
