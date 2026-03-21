import Link from 'next/link';
import {PATHS} from '@/constants.mjs';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {sp} from '@/app/games/session/_utils';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdGroupStrengthsStartPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col justify-center">
            <p>Here are the instructions for picking strength in group</p>
            <Link
              href={sp(PATHS.strengthSessionPlayerGroupStrengths, sessionId)}
            >
              continue
            </Link>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
