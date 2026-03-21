import Link from 'next/link';
import {PATHS} from '@/constants.mjs';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {sp} from '@/app/games/session/_utils';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionHostSessionIdJoinPage(props: Props) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="mt-8 flex flex-col items-center justify-center px-4">
          <div>@TODO</div>
          <Link href={sp(PATHS.strengthSessionStats, sessionId)}>Go back</Link>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
