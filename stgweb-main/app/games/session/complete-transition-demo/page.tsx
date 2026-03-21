import {RevealTopStrength} from '../host/[sessionId]/complete-transition/RevealTopStrength';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionCompleteTransitionDemoPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="flex items-center justify-center">
          <RevealTopStrength
            sessionId={sessionId}
            topStrengthCount={82}
            topStrengthSlug="self-regulation"
          />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
