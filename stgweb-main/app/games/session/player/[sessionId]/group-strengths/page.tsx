import {GroupStrengthPicker} from './GroupStrengthPicker';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdGroupStrengthsPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <GroupStrengthPicker sessionId={sessionId} />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
