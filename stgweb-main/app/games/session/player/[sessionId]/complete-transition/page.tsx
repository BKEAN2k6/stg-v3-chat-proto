import {CompleteTransitionPage} from '../../../CompleteTransitionPage';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdCompleteTransitionPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="flex items-center justify-center px-4">
          <CompleteTransitionPage sessionId={sessionId} />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
