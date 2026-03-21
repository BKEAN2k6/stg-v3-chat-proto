'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {sp, wsevent} from '../../../_utils';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

type Props = {
  readonly sessionId: string;
};

export const GroupStrengthPicker = (props: Props) => {
  const {sessionId} = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePickStrength = async (event: any, slug: StrengthSlug) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    const directus = createClientSideDirectusClient();
    await refreshAuthIfExpired({force: true});
    const newStrength: any = await directus
      .items('strength_session_strength')
      .createOne({
        strength_session: sessionId,
        strength: StrengthIDMap[slug],
        is_for_group: true,
      });
    wsevent({
      sessionId,
      eventType: 'session_strength_seen',
      lookupValue: newStrength?.id,
    });
    // @TODO add moment to group wall (with a special flag "from_strength_session")
    router.push(sp(PATHS.strengthSessionPlayerStats, sessionId));
  };

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col justify-center space-y-4">
            {/* prettier-ignore */}
            <a href='#' onClick={async event => handlePickStrength(event, 'kindness')}>Kindness</a>
            {/* prettier-ignore */}
            <a href='#' onClick={async event => handlePickStrength(event, 'perseverance')}>Perseverance</a>
            {/* prettier-ignore */}
            <a href='#' onClick={async event => handlePickStrength(event, 'self-regulation')}>Self-regulation</a>
            {/* <Link
              href={sp(
                PATHS.strengthSessionPlayerPeerStrengthsStart,
                sessionId
              )}
            >
              continue
            </Link> */}
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
};
