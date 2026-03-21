'use client';

import {useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {Loader} from '@/components/atomic/atoms/Loader';
import {sp} from '@/lib/utils';

type Props = {
  readonly sessionId: string;
};

export const RedirectToStats = (props: Props) => {
  const {sessionId} = props;
  const router = useRouter();

  useLegacyEffect(() => {
    setTimeout(() => {
      router.push(sp(PATHS.strengthSessionStats, {sessionId}));
    }, 2000);
  }, []);

  return (
    <div className="min-safe-h-screen flex w-full flex-col items-center justify-center space-y-4">
      <Loader />
    </div>
  );
};
